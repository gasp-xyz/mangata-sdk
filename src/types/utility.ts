import { Merge } from "type-fest";
import { BN } from "@polkadot/util";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { ExtrinsicCommon } from "./common";

export type Batch = Merge<
  ExtrinsicCommon,
  { calls: SubmittableExtrinsic<"promise", ISubmittableResult>[] }
>;

export type PriceImpact = {
  poolBalance: { firstTokenBalance: BN; secondTokenBalance: BN };
  poolDecimals: { firstTokenDecimals: number; secondTokenDecimals: number };
  firstTokenAmount: string;
  secondTokenAmount: string;
};
