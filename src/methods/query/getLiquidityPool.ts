import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";

/**
 * @since 2.0.0
 */
export const getLiquidityPool = async (
  instancePromise: Promise<ApiPromise>,
  liquidityTokenId: TokenId
): Promise<TokenId[]> => {
  const api = await instancePromise;
  const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
  if (!liquidityPool.isSome) return [-1, -1];
  return liquidityPool.unwrap().map((num) => num.toNumber());
};
