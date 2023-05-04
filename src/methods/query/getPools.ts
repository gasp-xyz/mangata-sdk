import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Pool, TPoolWithRatio, TTokenInfo } from "../../types/query";
import { getAssetsInfoWithIds } from "../../utils/getAssetsInfoWithIds";
import { getLiquidityAssets } from "../../utils/getLiquidityAssets";
import { getLiquidityPromotedPools } from "../../utils/getLiquidityPromotedPools";
import { getPoolsBalance } from "../../utils/getPoolsBalance";
import { getRatio } from "../../utils/getRatio";

export const getPools = async (
  instancePromise: Promise<ApiPromise>
): Promise<TPoolWithRatio[]> => {
  const api = await instancePromise;
  const [assetsInfo, liquidityAssets, liquidityTokensPromoted] =
    await Promise.all([
      getAssetsInfoWithIds(api),
      getLiquidityAssets(api),
      getLiquidityPromotedPools(api)
    ]);
  const poolBalances = await getPoolsBalance(api, liquidityAssets);

  return Object.values(assetsInfo)
    .reduce(
      (acc, asset) =>
        Object.values(liquidityAssets).includes(asset.id)
          ? acc.concat(asset)
          : acc,
      [] as TTokenInfo[]
    )
    .map((asset: TTokenInfo) => {
      const [firstTokenAmount, secondTokenAmount] = poolBalances[asset.id];
      return {
        firstTokenId: asset.symbol.split("-")[0],
        secondTokenId: asset.symbol.split("-")[1],
        firstTokenAmount,
        secondTokenAmount,
        liquidityTokenId: asset.id,
        firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
        secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
        isPromoted: liquidityTokensPromoted.includes(asset.id)
      } as Pool & { firstTokenRatio: BN; secondTokenRatio: BN };
    });
};
