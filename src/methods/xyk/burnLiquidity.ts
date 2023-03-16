import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../signTx";
import { BurnLiquidity } from "../../types/xyk";

async function burnLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function burnLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function burnLiquidity(
  instancePromise: Promise<ApiPromise>,
  args: BurnLiquidity,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, firstTokenId, secondTokenId, amount, txOptions } = args;
  const tx = api.tx.xyk.burnLiquidity(firstTokenId, secondTokenId, amount);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { burnLiquidity };
