import { ApiPromise } from "@polkadot/api";

export const getLiquidityPromotedPools = async (api: ApiPromise) => {
  try {
    const promotedPoolRewards =
      await api.query.proofOfStake.promotedPoolRewards();

    return Object.keys(promotedPoolRewards.toHuman());
  } catch (error) {
    return [];
  }
};
