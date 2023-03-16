import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { Amount } from "../../types/common";
import { Transfer } from "../../types/tokens";
import { signTx } from "../../signTx";

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: Transfer & { amount: Amount },
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: Transfer & { amount: Amount },
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: Transfer & { amount: Amount },
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, tokenId, address, txOptions, amount } = args;
  const tx = api.tx.tokens.transfer(address, tokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { transferTokens };
