import { mainnet, testnet } from "@zetachain/protocol-contracts";
import ZRC20 from "@zetachain/protocol-contracts/abi/zevm/ZRC20.sol/ZRC20.json";
import { ethers, utils } from "ethers";
import fetch from "isomorphic-fetch";

import { ZetaChainClient } from "./client";

const fetchZEVMFees = async function (zrc20: any, rpcUrl: string) {
  const provider = new ethers.providers.StaticJsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(zrc20.address, ZRC20.abi, provider);
  const [, withdrawGasFee] = await contract.withdrawGasFee();
  const gasFee = ethers.BigNumber.from(withdrawGasFee);
  const protocolFee = ethers.BigNumber.from(await contract.PROTOCOL_FLAT_FEE());
  return {
    /* eslint-disable */
    ...zrc20,
    totalFee: utils.formatUnits(gasFee, 18),
    gasFee: utils.formatUnits(gasFee.sub(protocolFee), 18),
    protocolFee: utils.formatUnits(protocolFee, 18),
    /* eslint-enable */
  };
};

const fetchCCMFees = async function (
  this: ZetaChainClient,
  chainID: string,
  gas: Number
) {
  // Skip ZetaChain as we can't send messages from ZetaChain to ZetaChain
  if (chainID === "7000" || chainID === "7001") return;
  const API = this.getEndpoint("cosmos-http", `zeta_${this.network}`);
  if (!API) {
    throw new Error("API endpoint not found");
  }
  const url = `${API}/zeta-chain/crosschain/convertGasToZeta?chainId=${chainID}&gasLimit=${gas}`;
  const response = await fetch(url);
  const data = await response.json();
  const gasFee = ethers.BigNumber.from(data.outboundGasInZeta);
  const protocolFee = ethers.BigNumber.from(data.protocolFeeInZeta);
  return {
    /* eslint-disable */
    totalFee: utils.formatUnits(gasFee.add(protocolFee), 18),
    gasFee: utils.formatUnits(gasFee, 18),
    protocolFee: utils.formatUnits(protocolFee, 18),
    /* eslint-enable */
  };
};

type Fees = {
  messaging: Array<{ [key: string]: string }>;
  omnichain: Array<{ [key: string]: string }>;
};

export const getFees = async function (this: ZetaChainClient, gas: Number) {
  let fees: Fees = {
    messaging: [],
    omnichain: [],
  };
  const supportedChains = await this.getSupportedChains();

  const addresses = this.network === "mainnet" ? mainnet : testnet;
  const zrc20Addresses = addresses.filter((a: any) => a.type === "zrc20");

  await Promise.all(
    supportedChains.map(async (n: { chain_id: string; chain_name: string }) => {
      try {
        const fee = await fetchCCMFees.call(this, n.chain_id, gas);
        if (fee) fees.messaging.push(fee);
      } catch (err) {
        console.log(err);
      }
    })
  );
  await Promise.all(
    zrc20Addresses.map(async (zrc20: any) => {
      try {
        const rpcUrl = this.getEndpoint("evm", `zeta_${this.network}`);
        const fee = await fetchZEVMFees(zrc20, rpcUrl);
        fees.omnichain.push(fee);
      } catch (err) {
        console.log(err);
      }
    })
  );
  return fees;
};
