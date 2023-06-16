import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { BN } from "@polkadot/util";

export const getWeightXTokens = (
  weight: BN,
  extrinsicCall?: SubmittableExtrinsicFunction<"promise">
): BN | { Limited: BN } => {
  return extrinsicCall?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")
    ? {
        Limited: weight
      }
    : weight;
};
