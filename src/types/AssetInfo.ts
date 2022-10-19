import { BN } from "@polkadot/util";
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { XcmTxOptions } from "./TxOptions";

export type AssetInfo = {
  id: string;
  infoToken: {
    name: string;
    symbol: string;
    description: string;
    decimals: string;
  };
};

export type TToken = {
  id: TTokenId;
  chainId: number;
  name: TTokenName;
  symbol: TTokenSymbol;
  address: TTokenAddress;
  decimals: number;
  balance: TokenBalance;
};

export type TTokenMainInfo = Omit<TToken, "id" | "balance" | "chainId">;
export type TTokenInfo = Omit<TToken, "balance">;
export type TTokenId = string;
export type TTokenAddress = string;
export type TTokenName = string;
export type TTokenSymbol = string;
export type TFreeBalance = BN;
export type TReservedBalance = BN;
export type TFrozenBalance = BN;

export type TTokens = Record<TTokenId, TToken>;
export type TBalances = Record<TTokenId, BN>;
export type TMainTokens = Record<TTokenId, TTokenInfo>;

export type TPool = {
  firstTokenId: TTokenId;
  secondTokenId: TTokenId;
  firstTokenAmount: BN;
  secondTokenAmount: BN;
  liquidityTokenId: TTokenId;
  isPromoted: boolean;
};

export type TPoolWithShare = TPool & {
  share: BN;
  firstTokenRatio: BN;
  secondTokenRatio: BN;
  activatedLPTokens: BN;
  nonActivatedLPTokens: BN;
};

export type TPoolWithRatio = TPool & {
  firstTokenRatio: BN;
  secondTokenRatio: BN;
};

export type TokenBalance = {
  free: TFreeBalance;
  reserved: TReservedBalance;
  frozen: TFreeBalance;
};

export type DepositXcmTuple = [
  mangataApi: ApiPromise,
  url: string,
  tokenSymbol: string,
  destWeight: string,
  account: string | KeyringPair,
  mangataAddress: string,
  amount: BN,
  txOptions?: XcmTxOptions
];

export type WithdrawXcmTuple = [
  api: ApiPromise,
  tokenSymbol: string,
  withWeight: string,
  parachainId: number,
  account: string | KeyringPair,
  destinationAddress: string,
  amount: BN,
  txOptions?: XcmTxOptions
];
