import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { MintLiquidity } from "../../types/xyk";

export const mintLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: MintLiquidity
) => {
  const api = await instancePromise;
  const {
    account,
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount,
    txOptions
  } = args;
  const tx = api.tx.xyk.mintLiquidity(
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    expectedSecondTokenAmount
  );
  return await signTx(api, tx, account, txOptions);
};
