import { ApiPromise } from "@polkadot/api";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
import { CreatePool } from "../../types/xyk";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";

async function createPool(
  instancePromise: Promise<ApiPromise>,
  args: CreatePool,
  isForBatch: false
): Promise<MangataGenericEvent[]>;
async function createPool(
  instancePromise: Promise<ApiPromise>,
  args: CreatePool,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function createPool(
  instancePromise: Promise<ApiPromise>,
  args: CreatePool,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const {
    account,
    txOptions,
    firstTokenId,
    firstTokenAmount,
    secondTokenId,
    secondTokenAmount
  } = args;
  const tx = api.tx.xyk.createPool(
    firstTokenId,
    firstTokenAmount,
    secondTokenId,
    secondTokenAmount
  );

  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { createPool };
