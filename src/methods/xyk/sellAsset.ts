import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { SellAsset } from "../../types/xyk";

export const sellAsset = async (
  instancePromise: Promise<ApiPromise>,
  args: SellAsset
) => {
  const api = await instancePromise;
  const {
    account,
    txOptions,
    soldTokenId,
    boughtTokenId,
    amount,
    minAmountOut
  } = args;
  const tx = api.tx.xyk.sellAsset(
    soldTokenId,
    boughtTokenId,
    amount,
    minAmountOut
  );
  return await signTx(api, tx, account, txOptions);
};
