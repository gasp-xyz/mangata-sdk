import { ApiPromise } from "@polkadot/api";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
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

/**
Creates a new pool
@param instancePromise - The API promise that resolves to a PolkadotJS API instance
@param args - An object containing the necessary information to create a new pool
@param isForBatch - A boolean flag indicating whether the function should return an unsigned extrinsic or sign and send the transaction
@returns - If isForBatch is true, returns an unsigned extrinsic wrapped in a promise. Otherwise, returns an array of events wrapped in a promise after the transaction has been signed and sent
*/
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
