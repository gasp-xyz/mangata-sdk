import { MangataGenericEvent } from "../types/common";

export const isSellAssetTransactionSuccessful = (
    events: MangataGenericEvent[]
) => {
    const hasSuccess = events.some((item) => item.method === "ExtrinsicSuccess");
    const hasFailed = events.some(
        (item) =>
            item.method === "SellAssetFailedDueToSlippage" ||
            item.method === "MultiSwapAssetFailedOnAtomicSwap"
    );
    return hasSuccess && !hasFailed;
};