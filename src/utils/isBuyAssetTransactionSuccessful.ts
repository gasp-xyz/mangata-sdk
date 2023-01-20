import { MangataGenericEvent } from "../types/MangataGenericEvent";

export const isBuyAssetTransactionSuccessful = (
  results: MangataGenericEvent[]
) => {
  const successCount = results.filter(
    (item) => item.method === "ExtrinsicSuccess"
  ).length;
  const failedCount = results.filter(
    (item) => item.method === "BuyAssetFailedDueToSlippage"
  ).length;
  return successCount === 1 && failedCount === 0;
};
