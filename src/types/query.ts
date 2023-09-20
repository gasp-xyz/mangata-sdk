import { TokenId } from "./common";
import { BN } from "@polkadot/util";
import { Merge } from "type-fest";
import { PoolBase } from "./xyk";

export type Token = {
  id: TokenId;
  name: string;
  symbol: string;
  decimals: number;
  balance: TokenBalance;
};

export type TokenInfo = Omit<Token, "balance">;
export type MainTokens = Record<TokenId, TokenInfo>;
export type TokenBalance = {
  free: BN;
  reserved: BN;
  frozen: BN;
};
export type Pool = Merge<
  PoolBase,
  { liquidityTokenId: TokenId; isPromoted: boolean }
>;

export type PoolWithRatio = Merge<
  Pool,
  {
    firstTokenRatio: BN;
    secondTokenRatio: BN;
  }
>;

export type PoolWithShare = Pool & {
  share: BN;
  firstTokenRatio: BN;
  secondTokenRatio: BN;
  activatedLPTokens: BN;
  nonActivatedLPTokens: BN;
};

export type FeeLockType = {
  periodLength: string;
  feeLockAmount: string;
  swapValueThreshold: string;
  whitelistedTokens: number[];
};
