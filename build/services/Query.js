import { hexToBn, isHex, BN, BN_ZERO } from "@polkadot/util";
import { getCompleteAssetsInfo } from "../utils/getCompleteAssetsInfo";
import { getLiquidityAssets } from "../utils/getLiquidityAssets";
import { getPoolsBalance } from "../utils/getPoolsBalance";
import { getAccountBalances } from "../utils/getAccountBalances";
import { getAssetsInfoWithIds } from "../utils/getAssetsInfoWithIds";
import { calculateLiquidityShare } from "../utils/calculateLiquidityShare";
import { getRatio } from "../utils/getRatio";
import { getLiquidityPromotedPools } from "../utils/getLiquidityPromotedPools";
export class Query {
    static async getNonce(api, address) {
        const nonce = await api.rpc.system.accountNextIndex(address);
        return nonce.toBn();
    }
    static async getAmountOfTokenIdInPool(api, firstTokenId, secondTokenId) {
        const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);
        const tokenValue1 = balance[0].toString();
        const tokenValue2 = balance[1].toString();
        const token1 = isHex(tokenValue1)
            ? hexToBn(tokenValue1)
            : new BN(tokenValue1);
        const token2 = isHex(tokenValue2)
            ? hexToBn(tokenValue2)
            : new BN(tokenValue2);
        return [token1, token2];
    }
    static async getLiquidityTokenId(api, firstTokenId, secondTokenId) {
        const liquidityAssetId = await api.query.xyk.liquidityAssets([
            firstTokenId,
            secondTokenId
        ]);
        if (!liquidityAssetId.isSome)
            return BN_ZERO;
        return new BN(liquidityAssetId.toString());
    }
    static async getLiquidityPool(api, liquidityTokenId) {
        const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
        if (!liquidityPool.isSome)
            return [new BN(-1), new BN(-1)];
        return liquidityPool.unwrap().map((num) => new BN(num));
    }
    static async getTotalIssuance(api, tokenId) {
        const tokenSupply = await api.query.tokens.totalIssuance(tokenId);
        return new BN(tokenSupply);
    }
    static async getTokenBalance(api, address, tokenId) {
        const { free, reserved, frozen } = await api.query.tokens.accounts(address, tokenId);
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
    static async getNextTokenId(api) {
        const nextTokenId = await api.query.tokens.nextCurrencyId();
        return new BN(nextTokenId);
    }
    static async getTokenInfo(api, tokenId) {
        const assetsInfo = await this.getAssetsInfo(api);
        return assetsInfo[tokenId];
    }
    static async getLiquidityTokenIds(api) {
        const liquidityTokens = await api.query.xyk.liquidityAssets.entries();
        return liquidityTokens.map((liquidityToken) => liquidityToken[1].toString());
    }
    static async getLiquidityTokens(api) {
        const assetsInfo = await this.getAssetsInfo(api);
        return Object.values(assetsInfo).reduce((acc, curr) => {
            if (curr.name.includes("Liquidity Pool Token")) {
                acc[curr.id] = curr;
            }
            return acc;
        }, {});
    }
    static async getAssetsInfo(api) {
        const completeAssetsInfo = await getCompleteAssetsInfo(api);
        // we need to filter out ETH and Dummy liquidity token
        // then we need to display symbol for liquidity token
        return Object.values(completeAssetsInfo)
            .filter((assetsInfo) => !["1", "3", "6"].includes(assetsInfo.id))
            .reduce((obj, item) => {
            const asset = {
                ...item,
                name: item.name.replace(/0x\w+/, "").replace(/[A-Z]/g, " $&").trim(),
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
                    }, [])
                        .join("-")
                    : item.symbol
            };
            obj[asset.id] = asset;
            return obj;
        }, {});
    }
    static async getBlockNumber(api) {
        const block = await api.rpc.chain.getBlock();
        return block.block.header.number.toString();
    }
    static async getOwnedTokens(api, address) {
        if (!address)
            return null;
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
        }, {});
    }
    // In the next major release rename this to
    // getTotalIssuanceOfTokens
    static async getBalances(api) {
        const balancesResponse = await api.query.tokens.totalIssuance.entries();
        return balancesResponse.reduce((acc, [key, value]) => {
            const id = key.toHuman()[0].replace(/[, ]/g, "");
            const balance = new BN(value.toString());
            acc[id] = balance;
            return acc;
        }, {});
    }
    static async getInvestedPools(api, address) {
        const [assetsInfo, accountBalances, liquidityTokensPromoted] = await Promise.all([
            getAssetsInfoWithIds(api),
            getAccountBalances(api, address),
            getLiquidityPromotedPools(api)
        ]);
        const poolsInfo = Object.values(assetsInfo)
            .reduce((acc, asset) => {
            if (Object.keys(accountBalances).includes(asset.id) &&
                asset.name.includes("Liquidity Pool Token")) {
                acc.push(asset);
            }
            return acc;
        }, [])
            .map(async (asset) => {
            const userLiquidityBalance = accountBalances[asset.id];
            const firstTokenId = asset.symbol.split("-")[0];
            const secondTokenId = asset.symbol.split("-")[1];
            const [firstTokenAmount, secondTokenAmount] = await this.getAmountOfTokenIdInPool(api, firstTokenId.toString(), secondTokenId.toString());
            const share = await calculateLiquidityShare(api, asset.id, userLiquidityBalance.free.add(userLiquidityBalance.reserved));
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
            };
            return poolInfo;
        });
        return Promise.all(poolsInfo);
    }
    static async getPool(api, liquidityTokenId) {
        const liquidityPoolTokens = await this.getLiquidityPool(api, liquidityTokenId);
        const promotedPoolRewardsV2 = await api.query.issuance.promotedPoolsRewardsV2();
        const promotedPoolInfos = promotedPoolRewardsV2.toHuman();
        const isPoolPromoted = promotedPoolInfos[liquidityTokenId];
        const [firstTokenId, secondTokenId] = liquidityPoolTokens;
        const [firstTokenAmount, secondTokenAmount] = await this.getAmountOfTokenIdInPool(api, firstTokenId.toString(), secondTokenId.toString());
        return {
            firstTokenId: firstTokenId.toString(),
            secondTokenId: secondTokenId.toString(),
            firstTokenAmount,
            secondTokenAmount,
            liquidityTokenId,
            isPromoted: isPoolPromoted === undefined
                ? false
                : new BN(isPoolPromoted.rewards.replace(/[, ]/g, "")).gt(BN_ZERO),
            firstTokenRatio: getRatio(firstTokenAmount, secondTokenAmount),
            secondTokenRatio: getRatio(secondTokenAmount, firstTokenAmount)
        };
    }
    static async getPools(api) {
        const [assetsInfo, liquidityAssets] = await Promise.all([
            getAssetsInfoWithIds(api),
            getLiquidityAssets(api)
        ]);
        const poolBalances = await getPoolsBalance(api, liquidityAssets);
        const liquidityTokensPromoted = await getLiquidityPromotedPools(api);
        return Object.values(assetsInfo)
            .reduce((acc, asset) => Object.values(liquidityAssets).includes(asset.id)
            ? acc.concat(asset)
            : acc, [])
            .map((asset) => {
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
            };
        });
    }
}
