import { BN } from "@polkadot/util";
export const calculateFutureRewardsAmountForMinting = async (api, liquidityTokenId, mintingAmount, blocksToPass) => {
    const rewardsPerSession = new BN("136986000000000000000000");
    const sessionsToPass = blocksToPass.div(new BN("1200"));
    const totalRewardsMinted = sessionsToPass.mul(rewardsPerSession);
    const promotedPoolRewardsV2 = await api.query.issuance.promotedPoolsRewardsV2();
    const promotedPoolInfos = promotedPoolRewardsV2.toHuman();
    const totalWeight = Object.values(promotedPoolInfos).reduce((acc, curr) => acc.add(new BN(curr.weight)), new BN(0));
    const poolWeight = new BN(promotedPoolInfos[liquidityTokenId].weight.toString());
    const rewardsMintedForPool = totalRewardsMinted
        .mul(poolWeight)
        .div(totalWeight);
    const totalActivatedLiquidityInPool = await api.query.xyk.liquidityMiningActivePoolV2(liquidityTokenId);
    return rewardsMintedForPool
        .mul(mintingAmount)
        .div(new BN(totalActivatedLiquidityInPool.toString()).add(mintingAmount));
};
