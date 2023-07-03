import ZetaConnector from "@zetachain/protocol-contracts/abi/evm/ZetaConnector.eth.sol/ZetaConnectorEth.json";
import ZetaEthContract from "@zetachain/protocol-contracts/abi/evm/Zeta.eth.sol/ZetaEth.json";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { getAddress } from "@zetachain/protocol-contracts";
import { parseEther } from "ethers/lib/utils";
import { ZetaConnectorEth } from "@zetachain/protocol-contracts/typechain-types";

declare const hre: any;

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  let connectorContract: ZetaConnectorEth;

  const { ethers } = hre as any;

  const [signer] = await ethers.getSigners();

  const destinationChainId = hre.config.networks[args.destination]?.chainId;
  if (!destinationChainId) {
    throw new Error("Invalid destination chain");
  }
  const destinationAddress = args.recipient || signer.address;
  const connectorAddress = getAddress("connector", hre.network.name as any);
  const zetaTokenAddress = getAddress("zetaToken", hre.network.name as any);

  connectorContract = new ethers.Contract(
    connectorAddress,
    ZetaConnector.abi,
    signer
  );
  const zetaTokenContract = new ethers.Contract(
    zetaTokenAddress,
    ZetaEthContract.abi,
    signer
  );
  await (
    await zetaTokenContract
      .connect(signer)
      .approve(connectorAddress, parseEther("5"))
  ).wait();

  const tx = await connectorContract.connect(signer).send({
    destinationChainId,
    destinationAddress,
    zetaValueAndGas: parseEther(args.amount),
    destinationGasLimit: 500000,
    message: ethers.utils.arrayify([]),
    zetaParams: ethers.utils.arrayify([]),
  });
  console.log(tx);
};

export const sendTask = task("send", "", main)
  .addParam("amount", "Amount of ZETA to send")
  .addParam("destination", "Destination chain");
