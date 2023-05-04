import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { SellAssetFee } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";

export const getSellAssetFee = async (
  instancePromise: Promise<ApiPromise>,
  args: SellAssetFee
): Promise<string> => {
  const api = await instancePromise;
  const { soldTokenId, boughtTokenId, amount, minAmountOut, account } = args;
  const dispatchInfo = await api.tx.xyk
    .sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut)
    .paymentInfo(account);
  return fromBN(new BN(dispatchInfo.partialFee.toString()));
};
