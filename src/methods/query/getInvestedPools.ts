import { ApiPromise } from "@polkadot/api";
import { PoolWithShare } from "../../types/query";
import { BN_ZERO } from "../../utils/bnConstants";
import { calculateLiquidityShare } from "../../utils/calculateLiquidityShare";
import { getAccountBalances } from "../../utils/getAccountBalances";
import { getAssetsInfoWithIds } from "../../utils/getAssetsInfoWithIds";
import { getLiquidityPromotedPools } from "../../utils/getLiquidityPromotedPools";
import { getRatio } from "../../utils/getRatio";
import { Address } from "../../types/common";
import { getAmountOfTokensInPool } from "./getAmountOfTokensInPool";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getInvestedPools = async (
  instancePromise: Promise<ApiPromise>,
  address: Address
): Promise<PoolWithShare[]> => {
  logger.info("getInvestedPools", { address });
  const api = await instancePromise;
  const [assetsInfo, accountBalances, liquidityTokensPromoted] =
    await Promise.all([
      getAssetsInfoWithIds(api),
      getAccountBalances(api, address),
      getLiquidityPromotedPools(api)
    ]);

  const poolsInfo = Object.values(assetsInfo)
    .filter(
      (asset) =>
        Object.keys(accountBalances).includes(asset.id.toString()) &&
        asset.name.includes("Liquidity Pool Token")
    )
    .map(async (asset) => {
      const userLiquidityBalance = accountBalances[asset.id];
      const [firstTokenId, secondTokenId] = asset.symbol.split("-");
      const [firstTokenAmount, secondTokenAmount] =
        await getAmountOfTokensInPool(
          instancePromise,
          firstTokenId,
          secondTokenId
        );
      const share = await calculateLiquidityShare(
        api,
        asset.id,
        userLiquidityBalance.free.add(userLiquidityBalance.reserved)
      );

      return {
        firstTokenId,
        secondTokenId,
        firstTokenAmount,
        secondTokenAmount,
        liquidityTokenId: asset.id,
        isPromoted: liquidityTokensPromoted.includes(asset.id),
        share,
        firstTokenRatio: share.eq(BN_ZERO)
          ? BN_ZERO
          : getRatio(firstTokenAmount, secondTokenAmount),
        secondTokenRatio: share.eq(BN_ZERO)
          ? BN_ZERO
          : getRatio(secondTokenAmount, firstTokenAmount),
        activatedLPTokens: userLiquidityBalance.reserved,
        nonActivatedLPTokens: userLiquidityBalance.free
      } as PoolWithShare;
    });

  return Promise.all(poolsInfo);
};
