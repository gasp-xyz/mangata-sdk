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
  TPoolWithRatio
} from "../types/AssetInfo";
import { getCompleteAssetsInfo } from "../utils/getCompleteAssetsInfo";
import { getLiquidityAssets } from "../utils/getLiquidityAssets";
import { getPoolsBalance } from "../utils/getPoolsBalance";
import { getAccountBalances } from "../utils/getAccountBalances";
import { getAssetsInfoWithIds } from "../utils/getAssetsInfoWithIds";
import { calculateLiquidityShare } from "../utils/calculateLiquidityShare";
import { getRatio } from "../utils/getRatio";
import { getLiquidityPromotedPools } from "../utils/getLiquidityPromotedPools";

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
    const pool = JSON.parse(
      JSON.stringify(await api.query.xyk.pools([firstTokenId, secondTokenId]))
    );
    const balance = pool as [string, string];
    const token1: BN = isHex(balance[0])
      ? hexToBn(balance[0])
      : new BN(balance[0]);
    const token2: BN = isHex(balance[1])
      ? hexToBn(balance[1])
      : new BN(balance[1]);
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
    if (!liquidityAssetId) return BN_ZERO;
    return new BN(liquidityAssetId.toString());
  }

  static async getLiquidityPool(
    api: ApiPromise,
    liquidityTokenId: TTokenId
  ): Promise<BN[]> {
    const liquidityPool = JSON.parse(
      JSON.stringify(await api.query.xyk.liquidityPools(liquidityTokenId))
    );
    if (!liquidityPool) return [new BN(-1), new BN(-1)];
    return liquidityPool.map((num: string) => new BN(num));
  }

  static async getTotalIssuance(
    api: ApiPromise,
    tokenId: TTokenId
  ): Promise<BN> {
    const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
    return new BN(tokenSupply.toString());
  }

  static async getTokenBalance(
    api: ApiPromise,
    address: TTokenAddress,
    tokenId: TTokenId
  ): Promise<TokenBalance> {
    const { free, reserved, frozen } = JSON.parse(
      JSON.stringify(await api.query.tokens.accounts(address, tokenId))
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
    return new BN(nextTokenId.toString());
  }

  static async getTokenInfo(
    api: ApiPromise,
    tokenId: TTokenId
  ): Promise<TTokenInfo> {
    const assetsInfo = await this.getAssetsInfo(api);
    return assetsInfo[tokenId];
  }

  static async getLiquidityTokenIds(api: ApiPromise): Promise<TTokenId[]> {
    const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
    return liquidityTokens.map((liquidityToken) =>
      liquidityToken[1].toString()
    );
  }

  static async getLiquidityTokens(api: ApiPromise): Promise<TMainTokens> {
    const assetsInfo = await this.getAssetsInfo(api);

    return Object.values(assetsInfo).reduce((acc, curr) => {
      if (curr.name.includes("Liquidity Pool Token")) {
        acc[curr.id] = curr;
      }
      return acc;
    }, {} as { [id: TTokenId]: TTokenInfo });
  }

  static async getAssetsInfo(api: ApiPromise): Promise<TMainTokens> {
    const completeAssetsInfo = await getCompleteAssetsInfo(api);
    // we need to filter out ETH and Dummy liquidity token
    // then we need to display symbol for liquidity token
    return Object.values(completeAssetsInfo)
      .filter((assetsInfo) => !["1", "3"].includes(assetsInfo.id))
      .reduce((obj, item) => {
        const asset = {
          ...item,
          name: item.name.replace(/0x\w+/, "").replace(/[A-Z]/g, "$&").trim(),
          symbol: item.symbol.includes("TKN")
            ? item.symbol
                .split("-")
                .reduce((acc, curr) => {
                  const currentValue = curr.replace("TKN", "");
                  const tokenId = currentValue.startsWith("0x")
                    ? hexToBn(currentValue).toString()
                    : currentValue;
                  const symbol = completeAssetsInfo[tokenId].symbol;
                  acc.push(symbol);
                  return acc;
                }, [] as string[])
                .join("-")
            : item.symbol
        };
        obj[asset.id] = asset;
        return obj;
      }, {} as { [id: TTokenId]: TTokenInfo });
  }

  static async getBlockNumber(api: ApiPromise): Promise<string> {
    const block = await api.rpc.chain.getBlock();
    return block.block.header.number.toString();
  }

  static async getOwnedTokens(
    api: ApiPromise,
    address: string
  ): Promise<{ [id: TTokenId]: TToken } | null> {
    if (!address) return null;

    const [assetsInfo, accountBalances] = await Promise.all([
      this.getAssetsInfo(api),
      getAccountBalances(api, address)
    ]);

    return Object.values(assetsInfo).reduce((acc, assetInfo) => {
      if (Object.keys(accountBalances).includes(assetInfo.id)) {
        acc[assetInfo.id] = {
          ...assetInfo,
          balance: accountBalances[assetInfo.id]
        };
      }
      return acc;
    }, {} as { [id: TTokenId]: TToken });
  }

  // In the next major release rename this to
  // getTotalIssuanceOfTokens
  static async getBalances(api: ApiPromise): Promise<TBalances> {
    const balancesResponse = await api.query.tokens.totalIssuance.entries();

    return balancesResponse.reduce((acc, [key, value]) => {
      const id = (key.toHuman() as string[])[0].replace(/[, ]/g, "");
      const balance = new BN(value.toString());
      acc[id] = balance;
      return acc;
    }, {} as { [id: string]: BN });
  }

  static async getInvestedPools(api: ApiPromise, address: TTokenAddress) {
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
          await this.getAmountOfTokenIdInPool(
            api,
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
  }

  static async getPool(api: ApiPromise, liquidityTokenId: TTokenId) {
    const liquidityPoolTokens = await this.getLiquidityPool(
      api,
      liquidityTokenId
    );
    const promotedPoolRewards =
      await api.query.proofOfStake.promotedPoolRewards();
    const promotedPoolInfos = promotedPoolRewards.toHuman() as {
      [key: string]: {
        weight: string;
        rewards: string;
      };
    };
    const isPoolPromoted = promotedPoolInfos[liquidityTokenId];

    const [firstTokenId, secondTokenId] = liquidityPoolTokens;
    const [firstTokenAmount, secondTokenAmount] =
      await this.getAmountOfTokenIdInPool(
        api,
        firstTokenId.toString(),
        secondTokenId.toString()
      );
    return {
      firstTokenId: firstTokenId.toString(),
      secondTokenId: secondTokenId.toString(),
      firstTokenAmount,
      secondTokenAmount,
      liquidityTokenId,
      isPromoted: !!isPoolPromoted,
      firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
      secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
    } as TPoolWithRatio;
  }

  static async getPools(api: ApiPromise): Promise<TPoolWithRatio[]> {
    const [assetsInfo, liquidityAssets] = await Promise.all([
      getAssetsInfoWithIds(api),
      getLiquidityAssets(api)
    ]);
    const poolBalances = await getPoolsBalance(api, liquidityAssets);
    const liquidityTokensPromoted = await getLiquidityPromotedPools(api);

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
