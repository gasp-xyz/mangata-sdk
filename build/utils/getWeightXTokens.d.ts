import { SubmittableExtrinsicFunction } from "@polkadot/api/types";
import { BN } from "@polkadot/util";
import { XcmWeightLimit } from "../types/xTokens";
export declare const getWeightXTokens: (weight: BN, extrinsicCall?: SubmittableExtrinsicFunction<"promise", import("@polkadot/types-codec/types").AnyTuple> | undefined) => XcmWeightLimit;
//# sourceMappingURL=getWeightXTokens.d.ts.map