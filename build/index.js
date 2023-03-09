import { ApiPromise, WsProvider } from "@polkadot/api";
import { options } from "@mangata-finance/types";
import { deactivateLiquidity } from "./methods/xyk/deactivateLiquidity";
import { activateLiquidity } from "./methods/xyk/activateLiquidity";
import { burnLiquidity } from "./methods/xyk/burnLiquidity";
import { transferAllTokens } from "./methods/tokens/transferAllTokens";
import { transferTokens } from "./methods/tokens/transferTokens";
import "@mangata-finance/types";
import { mintLiquidity } from "./methods/xyk/mintLiquidity";
import { deposit } from "./methods/xTokens/deposit";
import { buyAsset } from "./methods/xyk/buyAsset";
import { sellAsset } from "./methods/xyk/sellAsset";
import { createPool } from "./methods/xyk/createPool";
import { claimRewards } from "./methods/xyk/claimRewards";
import { calculateBuyPriceId } from "./methods/rpc/calculateBuyPriceId";
import { calculateSellPriceId } from "./methods/rpc/calculateSellPriceId";
import { getBurnAmount } from "./methods/rpc/getBurnAmount";
import { calculateSellPrice } from "./methods/rpc/calculateSellPrice";
import { calculateBuyPrice } from "./methods/rpc/calculateBuyPrice";
import { calculateRewardsAmount } from "./methods/rpc/calculateRewardsAmount";
import { getNodeVersion } from "./methods/rpc/getNodeVersion";
import { getNodeName } from "./methods/rpc/getNodeName";
import { getChain } from "./methods/rpc/getChain";
import { getPools } from "./methods/query/getPools";
import { getPool } from "./methods/query/getPool";
import { getLiquidityPool } from "./methods/query/getLiquidityPool";
import { getAmountOfTokenIdInPool } from "./methods/query/getAmountOfTokenIdInPool";
import { getInvestedPools } from "./methods/query/getInvestedPools";
import { getTotalIssuanceOfTokens } from "./methods/query/getTotalIssuanceOfTokens";
import { getOwnedTokens } from "./methods/query/getOwnedTokens";
import { getAssetsInfo } from "./methods/query/getAssetsInfo";
import { getBlockNumber } from "./methods/query/getBlockNumber";
import { getLiquidityTokens } from "./methods/query/getLiquidityTokens";
import { getLiquidityTokenIds } from "./methods/query/getLiquidityTokenIds";
import { getTokenInfo } from "./methods/query/getTokenInfo";
import { getTokenBalance } from "./methods/query/getTokenBalance";
import { getTotalIssuance } from "./methods/query/getTotalIssuance";
import { getLiquidityTokenId } from "./methods/query/getLiquidityTokenId";
import { getNonce } from "./methods/query/getNonce";
import { withdraw } from "./methods/xTokens/withdraw";
import { withdrawKsm } from "./methods/xTokens/withdrawKsm";
import { depositKsm } from "./methods/xTokens/depositKsm";
import { forTransferAllToken } from "./methods/fee/forTransferAllToken";
import { forTransferToken } from "./methods/fee/forTransferToken";
import { forBurnLiquidity } from "./methods/fee/forBurnLiquidity";
import { forMintLiquidity } from "./methods/fee/forMintLiquidity";
import { forBuyAsset } from "./methods/fee/forBuyAsset";
import { forSellAsset } from "./methods/fee/forSellAsset";
import { forCreatePool } from "./methods/fee/forCreatePool";
import { forClaimRewards } from "./methods/fee/forClaimRewards";
import { forDeactivateLiquidity } from "./methods/fee/forDeactivateLiquidity";
import { forActivateLiquidity } from "./methods/fee/forActivateLiquidity";
import { forWithdraw } from "./methods/fee/forWithdraw";
var Mangata;
(function (Mangata) {
    const instanceMap = new Map();
    // The getInstance function returns the instance for a given array of node URLs.
    Mangata.getInstance = (urls) => {
        /**
         * Generate a unique key for the given array of URLs.
         * Sort the URLs alphabetically before creating the key.
         * We want to ensure that the getInstance function only creates one instance
         * for any given array of URLs, regardless of the order of the URLs in the array
         */
        const key = JSON.stringify(urls.sort());
        // Check if an instance already exists for the given URLs.
        if (!instanceMap.has(key)) {
            // Create a new instance using the given URLs.
            const provider = new WsProvider(urls);
            const instance = ApiPromise.create(options({
                provider,
                throwOnConnect: true,
                throwOnUnknown: true,
                noInitWarn: true
            }));
            // Store the instance in the instanceMap.
            instanceMap.set(key, instance);
        }
        // Return the instance in a Promise.
        const instance = instanceMap.get(key);
        return {
            fee: {
                withdraw: (args) => forWithdraw(instance, args),
                activateLiquidity: (args) => forActivateLiquidity(instance, args),
                deactivateLiquidity: (args) => forDeactivateLiquidity(instance, args),
                claimRewards: (args) => forClaimRewards(instance, args),
                createPool: (args) => forCreatePool(instance, args),
                sellAsset: (args) => forSellAsset(instance, args),
                buyAsset: (args) => forBuyAsset(instance, args),
                mintLiquidity: (args) => forMintLiquidity(instance, args),
                burnLiquidity: (args) => forBurnLiquidity(instance, args),
                transferAllToken: (args) => forTransferAllToken(instance, args),
                transferToken: (args) => forTransferToken(instance, args)
            },
            query: {
                getNonce: (address) => getNonce(instance, address),
                getLiquidityTokenId: (firstTokenId, secondTokenId) => getLiquidityTokenId(instance, firstTokenId, secondTokenId),
                getTotalIssuance: (tokenId) => getTotalIssuance(instance, tokenId),
                getTokenBalance: (address, tokenId) => getTokenBalance(instance, address, tokenId),
                getTokenInfo: (tokenId) => getTokenInfo(instance, tokenId),
                getLiquidityTokenIds: () => getLiquidityTokenIds(instance),
                getLiquidityTokens: () => getLiquidityTokens(instance),
                getBlockNumber: () => getBlockNumber(instance),
                getOwnedTokens: (address) => getOwnedTokens(instance, address),
                getAssetsInfo: () => getAssetsInfo(instance),
                getInvestedPools: (address) => getInvestedPools(instance, address),
                getAmountOfTokenIdInPool: (firstTokenId, secondTokenId) => getAmountOfTokenIdInPool(instance, firstTokenId, secondTokenId),
                getLiquidityPool: (liquidityTokenId) => getLiquidityPool(instance, liquidityTokenId),
                getPool: (liquidityTokenId) => getPool(instance, liquidityTokenId),
                getPools: () => getPools(instance),
                getTotalIssuanceOfTokens: () => getTotalIssuanceOfTokens(instance)
            },
            rpc: {
                calculateBuyPriceId: (args) => calculateBuyPriceId(instance, args),
                calculateSellPriceId: (args) => calculateSellPriceId(instance, args),
                getBurnAmount: (args) => getBurnAmount(instance, args),
                calculateSellPrice: (args) => calculateSellPrice(instance, args),
                calculateBuyPrice: (args) => calculateBuyPrice(instance, args),
                calculateRewardsAmount: (args) => calculateRewardsAmount(instance, args),
                getNodeVersion: () => getNodeVersion(instance),
                getNodeName: () => getNodeName(instance),
                getChain: () => getChain(instance)
            },
            xyk: {
                deactivateLiquidity: (args) => deactivateLiquidity(instance, args),
                activateLiquidity: (args) => activateLiquidity(instance, args),
                burnLiquidity: (args) => burnLiquidity(instance, args),
                mintLiquidity: (args) => mintLiquidity(instance, args),
                buyAsset: (args) => buyAsset(instance, args),
                sellAsset: (args) => sellAsset(instance, args),
                createPool: (args) => createPool(instance, args),
                claimRewards: (args) => claimRewards(instance, args)
            },
            tokens: {
                transferAllTokens: (args) => transferAllTokens(instance, args),
                transferTokens: (args) => transferTokens(instance, args)
            },
            xTokens: {
                deposit: (args) => deposit(args),
                depositKsm: (args) => depositKsm(args),
                withdraw: (args) => withdraw(instance, args),
                withdrawKsm: (args) => withdrawKsm(instance, args)
            }
        };
    };
})(Mangata || (Mangata = {}));
async function testSingleton() {
    const urls = [
        "wss://mangata-x.api.onfinality.io/public-ws",
        "wss://prod-kusama-collator-01.mangatafinance.cloud"
    ];
    const instance = Mangata.getInstance(urls);
    const pool = await instance.query.getInvestedPools("5GBrzxeB3N4VwQFGMpgh518Jp7QzfgbNog8YBe96dDwx3c1x");
    console.log(pool);
}
testSingleton();
