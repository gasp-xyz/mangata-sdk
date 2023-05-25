import { Merge } from "type-fest";
import { BN } from "@polkadot/util";
import { ExtrinsicCommon, MangataSubmittableExtrinsic } from "./common";

export type Batch = Merge<
  ExtrinsicCommon,
  { calls: MangataSubmittableExtrinsic[] }
>;

export type PriceImpact = {
  poolBalance: { firstTokenBalance: BN; secondTokenBalance: BN };
  poolDecimals: { firstTokenDecimals: number; secondTokenDecimals: number };
  firstTokenAmount: string;
  secondTokenAmount: string;
};
