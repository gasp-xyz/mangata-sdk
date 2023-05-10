import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Pool, TPoolWithRatio, TTokenInfo } from "../../types/query";
import { getAssetsInfoWithIds } from "../../utils/getAssetsInfoWithIds";
import { getLiquidityAssets } from "../../utils/getLiquidityAssets";
import { getLiquidityPromotedPools } from "../../utils/getLiquidityPromotedPools";
import { getPoolsBalance } from "../../utils/getPoolsBalance";
import { getRatio } from "../../utils/getRatio";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/Array";

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

  return pipe(
    Object.values(assetsInfo),
    A.filter((asset) => Object.values(liquidityAssets).includes(asset.id)),
    A.map(({ symbol, id: liquidityTokenId }) => {
      const [firstTokenAmount, secondTokenAmount] =
        poolBalances[liquidityTokenId];
      const [firstTokenId, secondTokenId] = symbol.split("-");
      const firstTokenRatio = getRatio(firstTokenAmount, secondTokenAmount);
      const secondTokenRatio = getRatio(secondTokenAmount, firstTokenAmount);
      const isPromoted = liquidityTokensPromoted.includes(liquidityTokenId);
      return {
        firstTokenId,
        secondTokenId,
        firstTokenAmount,
        secondTokenAmount,
        liquidityTokenId,
        firstTokenRatio,
        secondTokenRatio,
        isPromoted
      } as Pool & { firstTokenRatio: BN; secondTokenRatio: BN };
    })
  );
};
