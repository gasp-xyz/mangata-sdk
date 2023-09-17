import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { MultiswapSellAsset } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

async function multiswapSellAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapSellAsset,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function multiswapSellAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapSellAsset,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise">>;

/**
 * @since 2.0.0
 */
async function multiswapSellAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapSellAsset,
  isForBatch: boolean
) {
  logger.info("Multiswap Sell Asset operation started ...");
  const api = await instancePromise;
  const { account, tokenIds, amount, minAmountOut, txOptions } = args;
  logger.info("multiswapSellAsset", {
    tokenIds,
    amount: amount.toString(),
    minAmountOut: minAmountOut.toString(),
    isBatch: isForBatch
  });
  const tx = api.tx.xyk.multiswapSellAsset(tokenIds, amount, minAmountOut);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { multiswapSellAsset };
