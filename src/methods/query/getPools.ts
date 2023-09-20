import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Pool, PoolWithRatio } from "../../types/query";
import { getAssetsInfoWithIds } from "../../utils/getAssetsInfoWithIds";
import { getLiquidityAssets } from "../../utils/getLiquidityAssets";
import { getLiquidityPromotedPools } from "../../utils/getLiquidityPromotedPools";
import { getPoolsBalance } from "../../utils/getPoolsBalance";
import { getRatio } from "../../utils/getRatio";

/**
 * @since 2.0.0
 */
export const getPools = async (
  instancePromise: Promise<ApiPromise>
): Promise<PoolWithRatio[]> => {
  const api = await instancePromise;
  const [assetsInfo, liquidityAssets, liquidityTokensPromoted] =
    await Promise.all([
      getAssetsInfoWithIds(api),
      getLiquidityAssets(api),
      getLiquidityPromotedPools(api)
    ]);
  const poolBalances = await getPoolsBalance(api, liquidityAssets);

  return Object.values(assetsInfo)
    .filter((asset) => Object.values(liquidityAssets).includes(asset.id))
    .map((asset) => {
      const [firstTokenAmount, secondTokenAmount] = poolBalances[asset.id];
      const [firstTokenId, secondTokenId] = asset.symbol.split("-");
      const firstTokenRatio = getRatio(firstTokenAmount, secondTokenAmount);
      const secondTokenRatio = getRatio(secondTokenAmount, firstTokenAmount);
      const isPromoted = liquidityTokensPromoted.includes(asset.id);
      return {
        firstTokenId,
        secondTokenId,
        firstTokenAmount,
        secondTokenAmount,
        liquidityTokenId: asset.id,
        firstTokenRatio,
        secondTokenRatio,
        isPromoted
      } as Pool & { firstTokenRatio: BN; secondTokenRatio: BN };
    });
};
