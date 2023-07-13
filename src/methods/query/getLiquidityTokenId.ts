import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getLiquidityTokenId = async (
  instancePromise: Promise<ApiPromise>,
  firstTokenId: TokenId,
  secondTokenId: TokenId
): Promise<TokenId> => {
  const api = await instancePromise;
  logger.info("getLiquidityTokenId", { firstTokenId, secondTokenId });
  const liquidityAssetId = await api.query.xyk.liquidityAssets([
    firstTokenId,
    secondTokenId
  ]);

  if (liquidityAssetId.isNone) {
    const liquidityAssetId = await api.query.xyk.liquidityAssets([
      secondTokenId,
      firstTokenId
    ]);
    return liquidityAssetId.unwrap().toString();
  }

  return liquidityAssetId.unwrap().toString();
};
