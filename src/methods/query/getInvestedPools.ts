import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TPool, TTokenInfo } from "../../types/query";
import { BN_ZERO } from "../../utils/bnConstants";
import { calculateLiquidityShare } from "../../utils/calculateLiquidityShare";
import { getAccountBalances } from "../../utils/getAccountBalances";
import { getAssetsInfoWithIds } from "../../utils/getAssetsInfoWithIds";
import { getLiquidityPromotedPools } from "../../utils/getLiquidityPromotedPools";
import { getRatio } from "../../utils/getRatio";
import { Address } from "../../types/common";
import { getAmountOfTokensInPool } from "./getAmountOfTokensInPool";

export const getInvestedPools = async (
  instancePromise: Promise<ApiPromise>,
  address: Address
) => {
  const api = await instancePromise;
  const [assetsInfo, accountBalances, liquidityTokensPromoted] =
    await Promise.all([
      getAssetsInfoWithIds(api),
      getAccountBalances(api, address),
      getLiquidityPromotedPools(api)
    ]);

  const poolsInfo = Object.values(assetsInfo)
    .reduce((acc, asset) => {
      if (
        Object.keys(accountBalances).includes(asset.id) &&
        asset.name.includes("Liquidity Pool Token")
      ) {
        acc.push(asset);
      }
      return acc;
    }, [] as TTokenInfo[])
    .map(async (asset: TTokenInfo) => {
      const userLiquidityBalance = accountBalances[asset.id];
      const firstTokenId = asset.symbol.split("-")[0];
      const secondTokenId = asset.symbol.split("-")[1];
      const [firstTokenAmount, secondTokenAmount] =
        await getAmountOfTokensInPool(
          instancePromise,
          firstTokenId.toString(),
          secondTokenId.toString()
        );
      const share = await calculateLiquidityShare(
        api,
        asset.id,
        userLiquidityBalance.free.add(userLiquidityBalance.reserved)
      );

      const poolInfo = {
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
      } as TPool & {
        share: BN;
        firstTokenRatio: BN;
        secondTokenRatio: BN;
        activatedLPTokens: BN;
        nonActivatedLPTokens: BN;
      };

      return poolInfo;
    });

  return Promise.all(poolsInfo);
};
