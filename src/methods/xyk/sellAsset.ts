import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { SellAsset } from "../../types/xyk";

async function sellAsset(
  instancePromise: Promise<ApiPromise>,
  args: SellAsset,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function sellAsset(
  instancePromise: Promise<ApiPromise>,
  args: SellAsset,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

/**
* @since 2.0.0
Sells an asset and returns either an array of generic events (if isForBatch=false) or a SubmittableExtrinsic (if isForBatch=true).
@param instancePromise - A Promise that resolves to an instance of ApiPromise.
@param  args - An object containing the necessary parameters for selling the asset.
@param isForBatch - A flag indicating whether the function is called as part of a batch or not.
@returns  An array of generic events or a SubmittableExtrinsic, depending on the value of isForBatch.
*/
async function sellAsset(
  instancePromise: Promise<ApiPromise>,
  args: SellAsset,
  isForBatch: boolean
) {
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
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { sellAsset };
