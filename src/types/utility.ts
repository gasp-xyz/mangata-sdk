import { Merge } from "type-fest";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { ExtrinsicCommon } from "src/types/common";

export type Batch = Merge<
  ExtrinsicCommon,
  { calls: SubmittableExtrinsic<"promise", ISubmittableResult>[] }
>;
