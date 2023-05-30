import { Merge } from "type-fest";
import { BN } from "@polkadot/util";
import {
  ExtrinsicCommon,
  MangataSubmittableExtrinsic,
  Prettify
} from "./common";

export type Batch = Merge<
  ExtrinsicCommon,
  { calls: MangataSubmittableExtrinsic[] }
>;

export type PoolReserves = [BN, BN];
export type TokenAmounts = [BN, BN];
export type TokenDecimals = [number, number];

export type PriceImpact = [PoolReserves, TokenDecimals, TokenAmounts];
