// https://github.com/PureStake/xcm-sdk/blob/main/packages/config/src/extrinsic/xTokens/xTokens.util.ts
// Thanks to this little helper from purestake
import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { BN } from "@polkadot/util";

export const getWeightXTokens = (
  weight: BN,
  extrinsicCall?: SubmittableExtrinsicFunction<"promise">
): BN | { Limited: BN } => {
  console.log(
    "HUHUHU",
    extrinsicCall?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")
  );
  return extrinsicCall?.meta.args.at(-1)?.type.eq("XcmV2WeightLimit")
    ? {
        Limited: weight
      }
    : weight;
};
