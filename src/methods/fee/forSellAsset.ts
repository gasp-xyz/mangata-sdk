import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { SellAsset } from "../../types/xyk";
import { fromBN } from "../../utils/bnUtility";
import { Except } from "type-fest";

export type SellAssetFee = Except<SellAsset, "txOptions">;

export const forSellAsset = async (
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
