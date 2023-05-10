import {
  Address,
  TokenAmount,
  ExtrinsicCommon,
  TxOptions,
  Prettify
} from "./common";
import { Merge, Except } from "type-fest";

export type XcmTxOptions = Partial<
  Omit<TxOptions, "statusCallback" | "extrinsicStatus">
>;

export type Deposit<A = unknown, D = unknown, W = unknown> = Prettify<
  Merge<
    ExtrinsicCommon,
    {
      url: string;
      asset: A;
      destination: D;
      weightLimit: W;
    }
  >
>;

export type Withdraw = Merge<
  ExtrinsicCommon,
  {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: TokenAmount;
  }
>;

export type RelayDeposit<
  A = unknown,
  D = unknown,
  F = unknown,
  B = unknown,
  W = unknown
> = Prettify<
  Merge<
    ExtrinsicCommon,
    {
      url: string;
      assets: A;
      destination: D;
      feeAssetItem: F;
      beneficiary: B;
      weightLimit: W;
    }
  >
>;

export type RelayWithdraw = Prettify<
  Merge<
    ExtrinsicCommon,
    {
      kusamaAddress: Address;
      amount: TokenAmount;
    }
  >
>;

export type WithdrawKsmFee = Except<RelayWithdraw, "txOptions">;
export type WithdrawFee = Except<Withdraw, "txOptions">;
export type DepositFromParachainFee = Except<Deposit, "txOptions">;
export type DepositFromKusamaOrStatemineFee = Except<RelayDeposit, "txOptions">;
