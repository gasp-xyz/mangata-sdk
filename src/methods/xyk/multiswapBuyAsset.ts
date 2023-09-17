import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { MangataGenericEvent } from "../../types/common";
import { signTx } from "../../utils/signTx";
import { MultiswapBuyAsset } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

async function multiswapBuyAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapBuyAsset,
  isForBatch: false
): Promise<MangataGenericEvent[]>;

async function multiswapBuyAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapBuyAsset,
  isForBatch: true
): Promise<SubmittableExtrinsic<"promise">>;

/**
 * @since 2.0.0
 */
async function multiswapBuyAsset(
  instancePromise: Promise<ApiPromise>,
  args: MultiswapBuyAsset,
  isForBatch: boolean
) {
  logger.info("Multiswap Buy Asset operation started ...");
  const api = await instancePromise;
  const { account, tokenIds, amount, maxAmountIn, txOptions } = args;
  logger.info("multiswapBuyAsset", {
    tokenIds,
    amount: amount.toString(),
    maxAmountIn: maxAmountIn.toString(),
    isBatch: isForBatch
  });
  const tx = api.tx.xyk.multiswapBuyAsset(tokenIds, amount, maxAmountIn);
  return isForBatch ? tx : await signTx(api, tx, account, txOptions);
}

export { multiswapBuyAsset };
