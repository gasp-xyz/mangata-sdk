export const isSellAssetTransactionSuccessful = (results) => {
    const successCount = results.filter((item) => item.method === "ExtrinsicSuccess").length;
    const failedCount = results.filter((item) => item.method === "SellAssetFailedDueToSlippage").length;
    return successCount === 1 && failedCount === 0;
};
