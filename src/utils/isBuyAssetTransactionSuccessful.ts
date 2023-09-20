import { MangataGenericEvent } from "../types/common";

export const isBuyAssetTransactionSuccessful = (
    events: MangataGenericEvent[]
) => {
    const hasSuccess = events.some((item) => item.method === "ExtrinsicSuccess");
    const hasFailed = events.some(
        (item) =>
            item.method === "BuyAssetFailedDueToSlippage" ||
            item.method === "MultiSwapAssetFailedOnAtomicSwap"
    );
    return hasSuccess && !hasFailed;
};