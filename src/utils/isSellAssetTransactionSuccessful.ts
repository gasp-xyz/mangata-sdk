import { MangataGenericEvent } from "../types/MangataGenericEvent";

export const isSellAssetTransactionSuccessful = (
  results: MangataGenericEvent[]
) => {
  const successCount = results.filter(
    (item) => item.method === "ExtrinsicSuccess"
  ).length;
  const failedCount = results.filter(
    (item) => item.method === "SellAssetFailedDueToSlippage"
  ).length;
  return successCount === 1 && failedCount === 0;
};
