import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";

/**
 * @since 2.0.0
 */
export const getLiquidityTokenId = async (
  instancePromise: Promise<ApiPromise>,
  firstTokenId: TokenId,
  secondTokenId: TokenId
): Promise<TokenId> => {
  const api = await instancePromise;
  const liquidityAssetId = await api.query.xyk.liquidityAssets([
    firstTokenId,
    secondTokenId
  ]);
  return liquidityAssetId.unwrap().toString();
};
