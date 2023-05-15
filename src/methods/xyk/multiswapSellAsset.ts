import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { MultiswapSellAsset } from "../../types/xyk";

async function multiswapSellAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapSellAsset,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function multiswapSellAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapSellAsset,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise", ISubmittableResult>>;

async function multiswapSellAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapSellAsset,
  isForBatch: boolean
) {
  const api = await instancePromise;
  const { account, tokenIds, amount, minAmountOut, txOptions } = args;
  const tx = api.tx.xyk.multiswapSellAsset(tokenIds, amount, minAmountOut);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { multiswapSellAsset };
