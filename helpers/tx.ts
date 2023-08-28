import { getEndpoints } from "@zetachain/networks";
import axios from "axios";
import clc from "cli-color";
import Spinnies from "spinnies";
import WebSocket from "ws";

const getEndpoint = (key: any): string => {
  const endpoint = getEndpoints(key, "zeta_testnet")[0]?.url;
  if (!endpoint) {
    throw new Error(`getEndpoints: ${key} endpoint not found`);
  }
  return endpoint;
};

const fetchCCTX = async (
  hash: string,
  spinnies: any,
  API: string,
  cctxList: any
) => {
  try {
    const url = `${API}/zeta-chain/crosschain/inTxHashToCctx/${hash}`;
    const apiResponse = await axios.get(url);
    const res = apiResponse?.data?.inTxHashToCctx?.cctx_index;
    res.forEach((cctxHash: any) => {
      if (cctxHash && !cctxList[cctxHash]) {
        cctxList[cctxHash] = [];
      }
      // if (!spinnies.spinners[`spinner-${cctxHash}`]) {
      //   spinnies.add(`spinner-${cctxHash}`, {
      //     text: `${cctxHash}`,
      //   });
      // }
    });
  } catch (error) {}
};

const SUBSCRIBE_MESSAGE = {
  id: 1,
  jsonrpc: "2.0",
  method: "subscribe",
  params: ["tm.event='NewBlock'"],
};

const fetchCCTXData = async (
  cctxHash: string,
  spinnies: any,
  API: string,
  cctxList: any
) => {
  const url = `${API}/zeta-chain/crosschain/cctx/${cctxHash}`;
  const apiResponse = await axios.get(url);
  const cctx = apiResponse?.data?.CrossChainTx;
  const tx = {
    receiver_chainId: cctx.outbound_tx_params[0].receiver_chainId,
    sender_chain_id: cctx.inbound_tx_params.sender_chain_id,
    status: cctx.cctx_status.status,
    status_message: cctx.cctx_status.status_message,
  };
  const lastCCTX = cctxList[cctxHash][cctxList[cctxHash].length - 1];
  const isEmpty = cctxList[cctxHash].length === 0;
  if (isEmpty || lastCCTX?.status !== tx.status) {
    cctxList[cctxHash].push(tx);
  }
};

const createWebSocketConnection = (
  WSS: string,
  inboundTxHash: string,
  spinnies: any,
  API: string,
  cctxList: any
) => {
  const socket = new WebSocket(WSS);
  socket.on("open", () => socket.send(JSON.stringify(SUBSCRIBE_MESSAGE)));
  socket.on("message", async () => {
    if (Object.keys(cctxList).length === 0) {
      await fetchCCTX(inboundTxHash, spinnies, API, cctxList);
    }
    for (const txHash in cctxList) {
      await fetchCCTX(txHash, spinnies, API, cctxList);
    }
    if (Object.keys(cctxList).length > 0) {
      for (const cctxHash in cctxList) {
        try {
          await fetchCCTXData(cctxHash, spinnies, API, cctxList);
        } catch (error) {}
      }
    }
    updateSpinners(cctxList, spinnies);
    if (
      Object.keys(cctxList).length > 0 &&
      Object.keys(cctxList)
        .map((c: any) => {
          const last = cctxList[c][cctxList[c].length - 1];
          return last?.status;
        })
        .filter((s) => !["OutboundMined", "Aborted", "Reverted"].includes(s))
        .length === 0
    ) {
      socket.close(1000);
    }
  });

  socket.on("close", (code) => {
    if (code !== 1000) {
      createWebSocketConnection(WSS, inboundTxHash, spinnies, API, cctxList);
    }
  });

  socket.on("error", (error: any) => {
    createWebSocketConnection(WSS, inboundTxHash, spinnies, API, cctxList);
  });

  return socket;
};

const updateSpinners = (cctxList: any, spinnies: any) => {
  if (!spinnies.spinners["search"]) {
    if (Object.keys(cctxList).length === 0) {
      spinnies.add(`search`, {
        text: `Looking for cross-chain transactions (CCTXs) on ZetaChain...\n`,
      });
    }
  } else {
    if (Object.keys(cctxList).length > 0) {
      spinnies.succeed(`search`, {
        text: `CCTXs on ZetaChain found.\n`,
      });
    }
  }
  for (const cctxHash in cctxList) {
    const last = cctxList[cctxHash][cctxList[cctxHash].length - 1];
    const id = `spinner-${cctxHash}`;
    const text = {
      text: `${cctxHash}: ${last.sender_chain_id} → ${last.receiver_chainId}: ${
        last.status
      } ${last.status_message && "(" + last.status_message + ")"}`,
    };
    if (!spinnies.spinners[id]) spinnies.add(id, text);
    switch (last.status) {
      case "OutboundMined":
      case "Reverted":
        spinnies.succeed(id, text);
        break;
      case "Aborted":
        spinnies.fail(id, text);
        break;
      default:
        spinnies.update(id, text);
        break;
    }
  }
};

export const trackCCTX = async (inboundTxHash: string): Promise<void> => {
  const spinnies = new Spinnies();

  const API = getEndpoint("cosmos-http");
  const WSS = getEndpoint("tendermint-ws");
  let cctxList: any = {};

  return new Promise(() => {
    const socket = createWebSocketConnection(
      WSS,
      inboundTxHash,
      spinnies,
      API,
      cctxList
    );
    socket.on("error", (error: any) => {
      createWebSocketConnection(WSS, inboundTxHash, spinnies, API, cctxList);
    });
    socket.on("close", (code) => {
      if (code !== 1000) {
        createWebSocketConnection(WSS, inboundTxHash, spinnies, API, cctxList);
      }
    });
  });
};
