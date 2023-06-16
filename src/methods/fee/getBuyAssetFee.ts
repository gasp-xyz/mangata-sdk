import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { BuyAssetFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

/**
 * @since 2.0.0
 */
export const getBuyAssetFee = async (
  instancePromise: Promise<ApiPromise>,
  args: BuyAssetFee
): Promise<string> => {
  const api = await instancePromise;
  const { soldTokenId, boughtTokenId, amount, maxAmountIn, account } = args;
  const dispatchInfo = await api.tx.xyk
    .buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
