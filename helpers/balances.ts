import ERC20_ABI from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { getAddress } from "@zetachain/protocol-contracts";
import ZRC20 from "@zetachain/protocol-contracts/abi/zevm/ZRC20.sol/ZRC20.json";
import { ethers } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import fetch from "isomorphic-fetch";
import { getEndpoints } from "../utils/getEndpoints";
import { getSupportedChains } from "../utils/getSupportedChains";
import { getForeignCoins } from "../utils/getForeignCoins";

export const getBalances = async (
  chains: any,
  network: any,
  evmAddress: any,
  btcAddress = null
) => {
  let tokens = [];
  const zetaCosmosHTTP = getEndpoints(
    chains,
    "cosmos-http",
    `zeta_${network}`
  )[0]?.url;
  const supportedChains = await getSupportedChains(zetaCosmosHTTP);
  const foreignCoins = await getForeignCoins(zetaCosmosHTTP);
  foreignCoins.forEach((token: any) => {
    if (token.coin_type === "Gas") {
      tokens.push({
        chain_id: token.foreign_chain_id,
        coin_type: token.coin_type,
        decimals: token.decimals,
        symbol: token.symbol,
        zrc20: token.zrc20_contract_address,
      });
      tokens.push({
        chain_id: network === "mainnet" ? 7000 : 7001,
        coin_type: "ZRC20",
        contract: token.zrc20_contract_address,
        decimals: token.decimals,
        symbol: token.symbol,
      });
    } else if (token.coin_type === "ERC20") {
      tokens.push({
        chain_id: token.foreign_chain_id,
        coin_type: "ERC20",
        contract: token.asset,
        decimals: token.decimals,
        symbol: token.symbol,
        zrc20: token.zrc20_contract_address,
      });
      tokens.push({
        chain_id: network === "mainnet" ? 7000 : 7001,
        coin_type: "ZRC20",
        contract: token.zrc20_contract_address,
        decimals: token.decimals,
        symbol: token.name,
      });
    }
  });
  supportedChains.forEach((chain: any) => {
    const contract = getAddress("zetaToken", chain.chain_name as any);
    if (contract) {
      tokens.push({
        chain_id: chain.chain_id,
        coin_type: "ERC20",
        contract,
        decimals: 18,
        symbol: "WZETA",
      });
    }
  });
  tokens.push({
    chain_id: network === "mainnet" ? 7000 : 7001,
    coin_type: "Gas",
    decimals: 18,
    symbol: "ZETA",
  });

  tokens = tokens.map((token: any) => {
    const ticker = token.symbol.split("-")[0];
    let chain_name;
    if (token.chain_id === 7001) {
      chain_name = "zeta_testnet";
    } else if (token.chain_id === 7000) {
      chain_name = "zeta_mainnet";
    } else {
      chain_name = supportedChains.find(
        (c: any) => c.chain_id === token.chain_id
      )?.chain_name;
    }
    return {
      ...token,
      chain_name,
      id: `${token.chain_id.toString().toLowerCase()}__${token.symbol
        .toLowerCase()
        .split(" ")
        .join("_")}`,
      ticker,
    };
  });

  const balances = await Promise.all(
    tokens.map(async (token: any) => {
      const isGas = token.coin_type === "Gas";
      const isBitcoin = token.chain_name === "btc_testnet";
      const isERC = token.coin_type === "ERC20";
      const isZRC = token.coin_type === "ZRC20";
      if (isGas && !isBitcoin) {
        try {
          const rpc = getEndpoints(chains, "evm", token.chain_name)[0]?.url;
          const provider = new ethers.providers.StaticJsonRpcProvider(rpc);
          return provider.getBalance(evmAddress).then((balance) => {
            return { ...token, balance: formatUnits(balance, token.decimals) };
          });
        } catch (e) {}
      } else if (isGas && isBitcoin && btcAddress) {
        try {
          const API = getEndpoints(chains, "esplora", "btc_testnet")[0]?.url;
          return fetch(`${API}/address/${btcAddress}`).then(
            async (response) => {
              const r = await response.json();
              const { funded_txo_sum, spent_txo_sum } = r.chain_stats;
              const balance = (
                (funded_txo_sum - spent_txo_sum) /
                100000000
              ).toString();
              return { ...token, balance };
            }
          );
        } catch (e) {}
      } else if (isERC) {
        const rpc = getEndpoints(chains, "evm", token.chain_name)[0]?.url;
        const provider = new ethers.providers.StaticJsonRpcProvider(rpc);
        const contract = new ethers.Contract(
          token.contract,
          ERC20_ABI.abi,
          provider
        );
        return contract.balanceOf(evmAddress).then((balance: any) => {
          return { ...token, balance: formatUnits(balance, token.decimals) };
        });
      } else if (isZRC) {
        const rpc = getEndpoints(chains, "evm", token.chain_name)[0]?.url;
        const provider = new ethers.providers.StaticJsonRpcProvider(rpc);
        const contract = new ethers.Contract(
          token.contract,
          ZRC20.abi,
          provider
        );
        return contract.balanceOf(evmAddress).then((balance: any) => {
          return {
            ...token,
            balance: formatUnits(balance, token.decimals),
          };
        });
      } else {
        return Promise.resolve(token);
      }
    })
  );
  return balances;
};
