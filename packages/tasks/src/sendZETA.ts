import confirm from "@inquirer/confirm";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { ZetaChainClient } from "../../client/src/";

declare const hre: any;

const main = async (args: any, hre: any) => {
  const client = new ZetaChainClient({ network: "testnet" });
  const [signer] = await hre.ethers.getSigners();

  const isDestinationZeta = ["zeta_testnet", "zeta_mainnet"].includes(
    args.destination
  );
  let fee = "0";

  if (!isDestinationZeta) {
    const fees = await client.getFees(5000000);
    const chainID = client.chains[args.destination].chain_id;
    const chainFee = fees.messaging.find((f: any) => f.chainID == chainID);
    if (!chainFee) {
      throw new Error(`Cannot fetch fees for chain ID ${chainID}`);
    }
    fee = chainFee.totalFee;
    if (parseFloat(args.amount) < parseFloat(fee))
      throw new Error(
        `Amount must be greater than ${fee} ZETA to cover the cross-chain fees`
      );
  }

  const { amount, destination } = args;
  const recipient = args.recipient || signer.address;
  const chain = hre.network.name;

  if (args.json) {
    const tx = await client.sendZeta({
      amount,
      chain,
      destination,
      recipient,
    });
    console.log(JSON.stringify(tx, null, 2));
  } else {
    console.log(`
Networks:        ${chain} → ${destination}
Amount sent:     ${amount} ZETA
Cross-chain fee: ${fee} ZETA
Amount received: ${(parseFloat(amount) - parseFloat(fee)).toFixed(
      18
    )} ZETA (estimated)
From address:    ${signer.address}
To address:      ${recipient}
`);

    await confirm(
      {
        message: `Please, confirm the transaction`,
      },
      { clearPromptOnDone: true }
    );
    const tx = await client.sendZeta({
      amount,
      chain,
      destination,
      recipient,
    });
    console.log(`Transaction successfully broadcasted!
Hash: ${tx.hash}`);
  }
};

export const sendZETATask = task(
  "send-zeta",
  "Send ZETA tokens between connected chains",
  main
)
  .addParam("amount", "Amount of ZETA to send")
  .addParam("destination", "Destination chain")
  .addOptionalParam("recipient", "Recipient address")
  .addFlag("json", "Output JSON");
