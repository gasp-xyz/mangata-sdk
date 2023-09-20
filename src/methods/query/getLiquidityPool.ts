import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getLiquidityPool = async (
  instancePromise: Promise<ApiPromise>,
  liquidityTokenId: TokenId
): Promise<TokenId[]> => {
  logger.info("getLiquidityPool", { liquidityTokenId });
  const api = await instancePromise;
  const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
  if (liquidityPool.isNone) return ["-1", "-1"];
  return liquidityPool.unwrap().map((num) => num.toString());
};
