import ERC20_ABI from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { networks } from "@zetachain/networks";
import { getAddress } from "@zetachain/protocol-contracts";
import ZRC20 from "@zetachain/protocol-contracts/abi/zevm/ZRC20.sol/ZRC20.json";
import { ethers } from "ethers";
import { getForeignCoins } from "../helpers/balances";
import { getChainId } from "@zetachain/networks";
import { fetchFees } from "../helpers/fees";

export const sendZRC20 = async (
  signer: any,
  amount: string,
  network: string,
  destination: string,
  recipient: string,
  token: string
) => {
  let value;
  try {
    value = ethers.utils.parseEther(amount);
  } catch (e) {
    throw new Error(
      `${value} is not a number and not a valid value for --amount, ${e}`
    );
  }

  const foreignCoins = await getForeignCoins();
  const networkChainID = networks[network as keyof typeof networks]?.chain_id;
  const foreignCoinsFiltered = foreignCoins.filter((coin: any) => {
    return coin.foreign_chain_id === networkChainID.toString();
  });
  let tx;
  if (network === "zeta_testnet") {
    const { zrc20_contract_address } = foreignCoins.find(
      (c: any) =>
        parseInt(c.foreign_chain_id) === getChainId(destination) &&
        c.symbol.toLocaleLowerCase() === token.toLocaleLowerCase()
    );
    const targetContract = new ethers.Contract(
      zrc20_contract_address,
      ZRC20.abi,
      signer
    );
    const targetDecimals = await targetContract.decimals();
    const to =
      destination === "btc_testnet"
        ? ethers.utils.toUtf8Bytes(recipient)
        : signer.address;

    const [gasAddress, gasFee] = await targetContract.withdrawGasFee();
    const gasContract = new ethers.Contract(gasAddress, ZRC20.abi, signer);

    const targetValue = ethers.utils.parseUnits(amount, targetDecimals);
    await (
      await gasContract.connect(signer).approve(gasAddress, gasFee)
    ).wait();
    return await targetContract.connect(signer).withdraw(to, targetValue);
  } else if (destination === "zeta_testnet") {
    const TSSAddress = getAddress("tss", network as any);
    const zrc20 = foreignCoinsFiltered.find(
      (coin: any) => coin.symbol.toLowerCase() === token.toLowerCase()
    );
    if (zrc20.coin_type.toLocaleLowerCase() === "erc20") {
      if (zrc20 === undefined) {
        throw new Error(
          `Token ${token} is not one of the available tokens to be deposited from ${network} to zeta_testnet`
        );
      }
      const erc20ContractAddress = zrc20.asset;
      const erc20TokenContract = new ethers.Contract(
        erc20ContractAddress,
        ERC20_ABI.abi,
        signer
      );
      const balance = await erc20TokenContract.balanceOf(signer.address);
      if (balance.lt(value)) {
        throw new Error("Insufficient token balance.");
      }
      const approveTx = await erc20TokenContract.approve(TSSAddress, value);
      await approveTx.wait();
      tx = await erc20TokenContract.transfer(TSSAddress, value);
    } else if (zrc20.coin_type.toLocaleLowerCase() === "gas") {
      tx = await signer.sendTransaction({
        to: TSSAddress,
        value,
      });
    }
    return tx;
  } else {
    throw new Error("Either --network or --destination should be zeta_testnet");
  }
};
