import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { BurnLiquidity } from "../../types/xyk";

export const burnLiquidity = async (
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity
) => {
  const api = await instancePromise;
  const { account, firstTokenId, secondTokenId, amount, txOptions } = args;
  const tx = api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, amount);
  return await signTx(api, tx, account, txOptions);
};
