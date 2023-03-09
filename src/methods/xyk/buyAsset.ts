import { ApiPromise } from "@polkadot/api";
import { signTx } from "../../signTx";
import { BuyAsset } from "../../types/xyk";

export const buyAsset = async (
  instancePromise: Promise<ApiPromise>,
  args: BuyAsset
) => {
  const api = await instancePromise;
  const {
    account,
    txOptions,
    soldTokenId,
    boughtTokenId,
    amount,
    maxAmountIn
  } = args;
  const tx = api.tx.xyk.buyAsset(
    soldTokenId,
    boughtTokenId,
    amount,
    maxAmountIn
  );
  return await signTx(api, tx, account, txOptions);
};
