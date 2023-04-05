export const getLiquidityPromotedPools = async (api) => {
    try {
        const promotedPoolRewardsV2 = await api.query.issuance.promotedPoolsRewardsV2();
        const promotedPoolInfos = promotedPoolRewardsV2.toHuman();
        return Object.keys(promotedPoolInfos);
    }
    catch (error) {
        return [];
    }
};
