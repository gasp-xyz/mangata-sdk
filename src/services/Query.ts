import { ApiPromise } from "@polkadot/api";
import { hexToBn, isHex, BN, BN_ZERO } from "@polkadot/util";

import {
  TToken,
  TTokenInfo,
  TBalances,
  TMainTokens,
  TokenBalance,
  TPool,
  TTokenAddress,
  TTokenId,
  TPoolWithRatio,
  TPoolWithShare
} from "../types/AssetInfo";
import { getAssetsInfoMap } from "../utils/getAssetsInfoMap";
import { liquidityAssetsMap } from "../utils/liquidityAssetsMap";
import { poolsBalanceMap } from "../utils/poolsBalanceMap";
import { balancesMap } from "../utils/balancesMap";
import { accountEntriesMap } from "../utils/accountEntriesMap";
import { getCorrectSymbol } from "../utils/getCorrectSymbol";
import { getAssetsInfoMapWithIds } from "../utils/getAssetsInfoMapWithIds";
import { calculateLiquidityShare } from "../utils/calculateLiquidityShare";
import { getRatio } from "../utils/getRatio";
import { liquidityPromotedTokenMap } from "../utils/liquidityPromotedTokenMap";

export class Query {
  static async getNonce(api: ApiPromise, address: TTokenAddress): Promise<BN> {
    const nonce = await api.rpc.system.accountNextIndex(address);
    return nonce.toBn();
  }

  static async getAmountOfTokenIdInPool(
    api: ApiPromise,
    firstTokenId: TTokenId,
    secondTokenId: TTokenId
  ): Promise<BN[]> {
    const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);
    const tokenValue1 = balance[0].toString();
    const tokenValue2 = balance[1].toString();
    const token1: BN = isHex(tokenValue1)
      ? hexToBn(tokenValue1)
      : new BN(tokenValue1);
    const token2: BN = isHex(tokenValue2)
      ? hexToBn(tokenValue2)
      : new BN(tokenValue2);
    return [token1, token2];
  }

  static async getLiquidityTokenId(
    api: ApiPromise,
    firstTokenId: TTokenId,
    secondTokenId: TTokenId
  ): Promise<BN> {
    const liquidityAssetId = await api.query.xyk.liquidityAssets([
      firstTokenId,
      secondTokenId
    ]);
    if (!liquidityAssetId.isSome) return BN_ZERO;
    return new BN(liquidityAssetId.toString());
  }

  static async getLiquidityPool(
    api: ApiPromise,
    liquidityTokenId: TTokenId
  ): Promise<BN[]> {
    const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
    if (!liquidityPool.isSome) return [new BN(-1), new BN(-1)];
    return liquidityPool.unwrap().map((num) => new BN(num));
  }

  static async getTotalIssuance(
    api: ApiPromise,
    tokenId: TTokenId
  ): Promise<BN> {
    const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
    return new BN(tokenSupply);
  }

  static async getTokenBalance(
    api: ApiPromise,
    address: TTokenAddress,
    tokenId: TTokenId
  ): Promise<TokenBalance> {
    const { free, reserved, frozen } = await api.query.tokens.accounts(
      address,
      tokenId
    );

    return {
      free: isHex(free.toString())
        ? hexToBn(free.toString())
        : new BN(free.toString()),
      reserved: isHex(reserved.toString())
        ? hexToBn(reserved.toString())
        : new BN(reserved.toString()),
      frozen: isHex(frozen.toString())
        ? hexToBn(frozen.toString())
        : new BN(frozen.toString())
    };
  }

  static async getNextTokenId(api: ApiPromise): Promise<BN> {
    const nextTokenId = await api.query.tokens.nextCurrencyId();
    return new BN(nextTokenId);
  }

  static async getTokenInfo(
    api: ApiPromise,
    tokenId: TTokenId
  ): Promise<TTokenInfo> {
    const assetsInfo = await getAssetsInfoMap(api);

    const asset = assetsInfo[tokenId];
    return asset.name.includes("LiquidityPoolToken")
      ? {
          ...asset,
          name: "Liquidity Pool Token",
          symbol: getCorrectSymbol(asset.symbol, assetsInfo)
        }
      : asset;
  }

  static async getLiquidityTokenIds(api: ApiPromise): Promise<TTokenId[]> {
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
    return liquidityTokens.map((liquidityToken) =>
      liquidityToken[1].toString()
    );
  }

  static async getLiquidityTokens(api: ApiPromise): Promise<TMainTokens> {
    const assetsInfo = await getAssetsInfoMap(api);

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) =>
          asset.name.includes("Liquidity Pool Token") ? acc.concat(asset) : acc,
        [] as TTokenInfo[]
      )
      .reduce((acc, assetInfo) => {
        acc[assetInfo.id] = assetInfo;
        return acc;
      }, {} as { [id: TTokenId]: TTokenInfo });
  }

  static async getAssetsInfo(api: ApiPromise): Promise<TMainTokens> {
    return await getAssetsInfoMap(api);
  }

  static async getBlockNumber(api: ApiPromise): Promise<string> {
    const block = await api.rpc.chain.getBlock();
    return block.block.header.number.toString();
  }

  static async getOwnedTokens(
    api: ApiPromise,
    address: string
  ): Promise<{ [id: TTokenId]: TToken } | null> {
    if (!address) {
      return null;
    }

    const [assetsInfo, accountEntries] = await Promise.all([
      getAssetsInfoMap(api),
      accountEntriesMap(api, address)
    ]);

    return Object.values(assetsInfo)
      .filter((assetInfo) => accountEntries[assetInfo.id])
      .reduce((acc, assetInfo) => {
        const asset = {
          ...assetInfo,
          balance: accountEntries[assetInfo.id]
        };

        acc[asset.id] = asset;
        return acc;
      }, {} as { [id: TTokenId]: TToken });
  }

  static async getBalances(api: ApiPromise): Promise<TBalances> {
    return await balancesMap(api);
  }

  static async getInvestedPools(
    api: ApiPromise,
    address: TTokenAddress
  ): Promise<Promise<TPoolWithShare>[]> {
    const [assetsInfo, accountEntries, liquidityTokensPromoted] =
      await Promise.all([
        getAssetsInfoMapWithIds(api),
        accountEntriesMap(api, address),
        liquidityPromotedTokenMap(api)
      ]);

    return Object.values(assetsInfo)
      .reduce(
        (acc, asset) => (accountEntries[asset.id] ? acc.concat(asset) : acc),
        [] as TTokenInfo[]
      )
      .filter((asset: TTokenInfo) =>
        asset.name.includes("Liquidity Pool Token")
      )
      .map(async (asset: TTokenInfo) => {
        const userLiquidityBalance = accountEntries[asset.id];
        const firstTokenId = asset.symbol.split("-")[0];
        const secondTokenId = asset.symbol.split("-")[1];
        const [firstTokenAmount, secondTokenAmount] =
          await this.getAmountOfTokenIdInPool(
            api,
            firstTokenId.toString(),
            secondTokenId.toString()
          );
        const poolInfo = {
          firstTokenId,
          secondTokenId,
          firstTokenAmount,
          secondTokenAmount,
          liquidityTokenId: asset.id,
          isPromoted: liquidityTokensPromoted.includes(asset.id),
          share: await calculateLiquidityShare(
            api,
            asset.id,
            userLiquidityBalance.free.add(userLiquidityBalance.reserved)
          ),
          firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
          secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount),
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
  }

  static async getPool(api: ApiPromise, liquidityTokenId: TTokenId) {
    const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
    const liquidityPoolId = JSON.parse(JSON.stringify(liquidityPool)) as [
      TTokenId,
      TTokenId
    ];
    const liquidityTokensPromoted = await liquidityPromotedTokenMap(api);
    const [firstTokenId, secondTokenId] = liquidityPoolId;
    const [firstTokenAmount, secondTokenAmount] =
      await this.getAmountOfTokenIdInPool(
        api,
        firstTokenId.toString(),
        secondTokenId.toString()
      );
    return {
      firstTokenId,
      secondTokenId,
      firstTokenAmount,
      secondTokenAmount,
      liquidityTokenId,
      isPromoted: liquidityTokensPromoted.includes(liquidityTokenId),
      firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
      secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
    } as TPoolWithRatio;
  }

  static async getPools(api: ApiPromise): Promise<TPoolWithRatio[]> {
    const [assetsInfo, liquidityAssets] = await Promise.all([
      getAssetsInfoMapWithIds(api),
      liquidityAssetsMap(api)
    ]);
    const poolBalances = await poolsBalanceMap(api, liquidityAssets);
    const liquidityTokensPromoted = await liquidityPromotedTokenMap(api);

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
        } as TPool & { firstTokenRatio: BN; secondTokenRatio: BN };
      });
  }
}
