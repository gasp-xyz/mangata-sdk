import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";

export const getLiquidityTokenIds = async (
  instancePromise: Promise<ApiPromise>
): Promise<TokenId[]> => {
  const api = await instancePromise;
  const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
  return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString());
};
