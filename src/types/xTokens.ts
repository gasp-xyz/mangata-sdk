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

export type Deposit = Prettify<
  Merge<
    ExtrinsicCommon,
    {
      url: string;
      asset: any;
      destination: any;
      weightLimit: any;
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

export type RelayDeposit = Prettify<
  Merge<
    ExtrinsicCommon,
    {
      url: string;
      assets: any;
      destination: any;
      feeAssetItem: any;
      beneficiary: any;
      weightLimit: any;
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
