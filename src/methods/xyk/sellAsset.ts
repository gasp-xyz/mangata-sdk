import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
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
