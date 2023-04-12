import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { Merge } from "type-fest";
import { MangataGenericEvent } from "../../types/common";
import { TokenAmount } from "../../types/common";
import { Transfer } from "../../types/tokens";
import { signTx } from "../../utils/signTx";

export type TransferTokens = Merge<Transfer, { amount: TokenAmount }>;

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: TransferTokens,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: TransferTokens,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function transferTokens(
  instancePromise: Promise<ApiPromise>,
  args: TransferTokens,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, tokenId, address, txOptions, amount } = args;
  const tx = api.tx.tokens.transfer(address, tokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { transferTokens };
