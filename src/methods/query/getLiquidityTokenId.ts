import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { BN } from "@polkadot/util";
import { BN_ZERO } from "../../utils/bnConstants";

export const getLiquidityTokenId = async (
  instancePromise: Promise<ApiPromise>,
  firstTokenId: TokenId,
  secondTokenId: TokenId
): Promise<BN> => {
  const api = await instancePromise;
  const liquidityAssetId = await api.query.xyk.liquidityAssets([
    firstTokenId,
    secondTokenId
  ]);
  if (!liquidityAssetId.isSome) return BN_ZERO;
  return new BN(liquidityAssetId.toString());
};
