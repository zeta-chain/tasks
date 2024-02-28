import confirm from "@inquirer/confirm";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import ERC20_ABI from "@openzeppelin/contracts/build/contracts/ERC20.json";

import { ZetaChainClient } from "../../client/src";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  const { ethers } = hre as any;
  const [signer] = await ethers.getSigners();

  const client = new ZetaChainClient({ network: "testnet", signer });

  const { amount, erc20 } = args;

  let message;
  if (args.message) {
    try {
      const m = JSON.parse(args.message);
      if (
        Array.isArray(m) &&
        m.length === 2 &&
        Array.isArray(m[0]) &&
        m[0].every((item: string) => typeof item === "string") &&
        m[1].every((item: string) => typeof item === "string")
      ) {
        message = args.message;
      } else {
        throw new Error('must be an array like [["string"], ["hello"]]');
      }
    } catch (e) {
      throw new Error(`Invalid message, ${e}`);
    }
  }

  const recipient = args.recipient || signer.address;

  const chain = hre.network.name;
  if (chain === "zeta_testnet" || chain === "zeta_mainnet") {
    throw new Error("Cannot from ZetaChain to ZetaChain.");
  }

  const data = { amount, chain, erc20, message, recipient };

  let symbol;
  if (erc20) {
    try {
      const contract = new ethers.Contract(erc20, ERC20_ABI.abi, signer);
      symbol = await contract.symbol();
    } catch (e) {
      throw new Error("Invalid ERC-20 address");
    }
  } else {
    const coins = await client.getForeignCoins();
    const chainId = client.getChainId(chain)?.toString();
    symbol = coins.find(
      (c: any) => c.coin_type === "Gas" && c.foreign_chain_id === chainId
    )?.symbol;
  }

  console.log(`
Networks:    ${chain} → zeta_testnet
Amount sent: ${amount} ${symbol || ""}
Sender:      ${signer.address}
Recipient:   ${recipient}`);
  if (message) {
    console.log(`Message:     ${message}`);
  }
  console.log("");
  await confirm(
    {
      message: `Please, confirm the transaction`,
    },
    { clearPromptOnDone: true }
  );
  const tx = await client.deposit(data);
  console.log(`Transaction successfully broadcasted!
  Hash: ${tx.hash}`);
};

export const depositTask = task("deposit", "Deposit", main)
  .addParam("amount", "Amount of ZRC-20 to send")
  .addOptionalParam("recipient", "Recipient address")
  .addOptionalParam("erc20", "ERC-20 token address")
  .addOptionalParam("message", `Message, like '[["string"], ["hello"]]'`);
