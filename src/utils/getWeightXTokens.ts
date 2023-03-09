import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { BN } from "@polkadot/util";
import { XcmWeightLimit } from "../types/xTokens";

export const getWeightXTokens = (
  weight: BN,
  extrinsicCall?: SubmittableExtrinsicFunction<"promise">
): XcmWeightLimit => {
  return extrinsicCall?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")
    ? {
        Limited: weight
      }
    : weight;
};
