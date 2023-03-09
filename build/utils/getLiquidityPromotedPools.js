export const getLiquidityPromotedPools = async (api) => {
    try {
        const promotedPoolRewards = await api.query.issuance.promotedPoolsRewardsV2();
        const promotedPoolInfos = promotedPoolRewards.toHuman();
        return Object.keys(promotedPoolInfos);
    }
    catch (error) {
        return [];
    }
};
