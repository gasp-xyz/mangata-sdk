import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
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

/**
 * Buy a token asset
 * @param instancePromise A promise that resolves to an instance of the `ApiPromise` class.
 * @param args An object containing the arguments needed to execute the transaction.
 * @param isForBatch A flag indicating whether the transaction is part of a batch. If true, the function returns a `SubmittableExtrinsic`. Otherwise, it returns an array of `MangataGenericEvent`.
 * @returns If `isForBatch` is true, returns a `SubmittableExtrinsic` representing the transaction. Otherwise, returns an array of `MangataGenericEvent` representing the events that occurred during the transaction.
 */

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
