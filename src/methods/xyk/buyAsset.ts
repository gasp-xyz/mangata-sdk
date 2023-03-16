import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
import { BuyAsset } from "../../types/xyk";

async function buyAsset(
  instancePromise: Promise<ApiPromise>,
  args: BuyAsset,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function buyAsset(
  instancePromise: Promise<ApiPromise>,
  args: BuyAsset,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function buyAsset(
  instancePromise: Promise<ApiPromise>,
  args: BuyAsset,
  isForBatch: boolean
) {
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
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { buyAsset };
