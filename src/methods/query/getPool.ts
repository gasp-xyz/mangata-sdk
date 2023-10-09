import { ApiPromise } from "@polkadot/api";
import { getRatio } from "../../utils/getRatio";
import { TokenId } from "../../types/common";
import { PoolWithRatio } from "../../types/query";
import { getLiquidityPool } from "./getLiquidityPool";
import { getAmountOfTokensInPool } from "./getAmountOfTokensInPool";
import { getLiquidityPromotedPools } from "../../utils/getLiquidityPromotedPools";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getPool = async (
  instancePromise: Promise<ApiPromise>,
  liquidityTokenId: TokenId
) => {
  logger.info("getPool", { liquidityTokenId });
  const api = await instancePromise;
  const [liquidityPoolTokens, promotedPoolRewards] = await Promise.all([
    getLiquidityPool(instancePromise, liquidityTokenId),
    getLiquidityPromotedPools(api)
  ]);

  const isPoolPromoted = promotedPoolRewards.includes(liquidityTokenId);

  const [firstTokenId, secondTokenId] = liquidityPoolTokens;
  const [firstTokenAmount, secondTokenAmount] = await getAmountOfTokensInPool(
    instancePromise,
    firstTokenId,
    secondTokenId
  );
  return {
    firstTokenId,
    secondTokenId,
    firstTokenAmount,
    secondTokenAmount,
    liquidityTokenId,
    isPromoted: isPoolPromoted,
    firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
    secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
  } as PoolWithRatio;
};
