import { ApiPromise } from "@polkadot/api";

export const liquidityPromotedTokenMap = async (api: ApiPromise) => {
  const liquidityAssetsResponse =
    await api.query.issuance.promotedPoolsRewards.entries();

  return liquidityAssetsResponse.map(
    ([key]) => key.args.map((k) => k.toHuman())[0] as string
  );
};
