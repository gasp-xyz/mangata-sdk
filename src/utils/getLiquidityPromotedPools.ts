import { ApiPromise } from "@polkadot/api";

export const getLiquidityPromotedPools = async (api: ApiPromise) => {
  try {
    const promotedPoolRewards =
      await api.query.proofOfStake.promotedPoolRewards();

    const promotedPoolInfos = promotedPoolRewards.toHuman() as {
      [key: string]: {
        weight: string;
        rewards: string;
      };
    };

    return Object.keys(promotedPoolInfos);
  } catch (error) {
    return [];
  }
};
