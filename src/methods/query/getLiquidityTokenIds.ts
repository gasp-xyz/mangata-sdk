import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";

/**
 * @since 2.0.0
 */
export const getLiquidityTokenIds = async (
  instancePromise: Promise<ApiPromise>
): Promise<TokenId[]> => {
  const api = await instancePromise;
  const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
  return liquidityTokens.map((liquidityToken) =>
    liquidityToken[1].unwrap().toString()
  );
};
