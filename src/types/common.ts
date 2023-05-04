import { BN } from "@polkadot/util";
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { Signer } from "@polkadot/api/types";
import type { ISubmittableResult, Codec } from "@polkadot/types/types";
import type { Event, Phase } from "@polkadot/types/interfaces";
import { SubmittableExtrinsic } from "@polkadot/api/types";

import {
  TBalances,
  TMainTokens,
  TokenBalance,
  TPool,
  TPoolWithRatio,
  Token,
  TTokenInfo,
  TPoolWithShare
} from "../types/query";
import {
  Deposit,
  DepositFromKusamaOrStatemineFee,
  DepositFromParachainFee,
  RelayDeposit,
  RelayWithdraw,
  Withdraw,
  WithdrawFee,
  WithdrawKsmFee
} from "../types/xTokens";

import {
  ActivateLiquidityFee,
  BurnLiquidity,
  BurnLiquidityFee,
  BuyAsset,
  BuyAssetFee,
  ClaimRewardsFee,
  CreatePool,
  CreatePoolFee,
  DeactivateLiquidityFee,
  Liquidity,
  MintLiquidity,
  MintLiquidityFee,
  Price,
  Reserve,
  Rewards,
  SellAsset,
  SellAssetFee
} from "../types/xyk";
import { Transfer, TransferAllFee, TransferTokenFee } from "../types/tokens";
import { Batch } from "./utility";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type ExtrinsicCommon = {
  account: Account;
  txOptions?: Partial<TxOptions>;
};
export interface Database {
  hasAddressNonce(address: string): boolean;
  setNonce(address: string, nonce: BN): void;
  getNonce(address: string): BN;
}
export type ErrorData = {
  Module?: {
    index?: string;
    error?: string;
  };
};
export type Account = string | KeyringPair;
export type TokenSymbol = string;
export type TokenId = string;
export type TokenAmount = BN;
export type Address = string;
export type MangataEventData = {
  lookupName: string;
  data: Codec;
};
export type MangataGenericEvent = {
  event: Event;
  phase: Phase;
  section: string;
  method: string;
  metaDocumentation: string;
  eventData: MangataEventData[];
  error: {
    documentation: string[];
    name: string;
  } | null;
};
export type TxOptions = {
  nonce: BN;
  signer: Signer;
  statusCallback: (result: ISubmittableResult) => void;
  extrinsicStatus: (events: MangataGenericEvent[]) => void;
};

export type MangataSubmittableExtrinsic = SubmittableExtrinsic<
  "promise",
  ISubmittableResult
>;

export interface MangataInstance {
  xTokens: {
    depositFromParachain: (args: Deposit) => Promise<void>;
    depositFromKusamaOrStatemine: (args: RelayDeposit) => Promise<void>;
    withdraw: (args: Withdraw) => Promise<void>;
    withdrawKsm: (args: RelayWithdraw) => Promise<void>;
  };
  xyk: {
    deactivateLiquidity: (args: Liquidity) => Promise<MangataGenericEvent[]>;
    activateLiquidity: (args: Liquidity) => Promise<MangataGenericEvent[]>;
    burnLiquidity: (args: BurnLiquidity) => Promise<MangataGenericEvent[]>;
    mintLiquidity: (args: MintLiquidity) => Promise<MangataGenericEvent[]>;
    buyAsset: (args: BuyAsset) => Promise<MangataGenericEvent[]>;
    sellAsset: (args: SellAsset) => Promise<MangataGenericEvent[]>;
    createPool: (args: CreatePool) => Promise<MangataGenericEvent[]>;
    claimRewards: (args: Liquidity) => Promise<MangataGenericEvent[]>;
  };
  rpc: {
    calculateBuyPriceId: (args: Price) => Promise<BN>;
    calculateSellPriceId: (args: Price) => Promise<BN>;
    getBurnAmount: (args: Price) => Promise<any>;
    calculateSellPrice: (args: Reserve) => Promise<BN>;
    calculateBuyPrice: (args: Reserve) => Promise<BN>;
    calculateRewardsAmount: (args: Rewards) => Promise<BN>;
    getNodeVersion: () => Promise<string>;
    getNodeName: () => Promise<string>;
    getChain: () => Promise<string>;
    waitForNewBlock: (blockNumber?: number) => Promise<boolean>;
  };
  tokens: {
    transferAllTokens: (args: Transfer) => Promise<MangataGenericEvent[]>;
    transferTokens: (
      args: Transfer & { amount: TokenAmount }
    ) => Promise<MangataGenericEvent[]>;
  };
  submitableExtrinsic: {
    createPool: (args: CreatePool) => Promise<MangataSubmittableExtrinsic>;
    claimRewards: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;
    sellAsset: (args: SellAsset) => Promise<MangataSubmittableExtrinsic>;
    buyAsset: (args: BuyAsset) => Promise<MangataSubmittableExtrinsic>;
    mintLiquidity: (
      args: MintLiquidity
    ) => Promise<MangataSubmittableExtrinsic>;
    burnLiquidity: (
      args: BurnLiquidity
    ) => Promise<MangataSubmittableExtrinsic>;
    activateLiquidity: (
      args: Liquidity
    ) => Promise<MangataSubmittableExtrinsic>;
    deactivateLiquidity: (
      args: Liquidity
    ) => Promise<MangataSubmittableExtrinsic>;
    transferAllTokens: (args: Transfer) => Promise<MangataSubmittableExtrinsic>;
    transferTokens: (
      args: Transfer & { amount: TokenAmount }
    ) => Promise<MangataSubmittableExtrinsic>;
  };
  query: {
    getNonce: (address: Address) => Promise<BN>;
    getLiquidityTokenId: (
      firstTokenId: TokenId,
      secondTokenId: TokenId
    ) => Promise<BN>;
    getTotalIssuance: (tokenId: TokenId) => Promise<BN>;
    getTokenBalance: (
      address: Address,
      tokenId: TokenId
    ) => Promise<TokenBalance>;
    getTokenInfo: (tokenId: TokenId) => Promise<TTokenInfo>;
    getLiquidityTokenIds: () => Promise<string[]>;
    getLiquidityTokens: () => Promise<TMainTokens>;
    getBlockNumber: () => Promise<string>;
    getOwnedTokens: (
      address: Address
    ) => Promise<{ [id: TokenId]: Token } | null>;
    getAssetsInfo: () => Promise<TMainTokens>;
    getInvestedPools: (address: Address) => Promise<TPoolWithShare[]>;
    getAmountOfTokensInPool: (
      firstTokenId: TokenId,
      secondTokenId: TokenId
    ) => Promise<BN[]>;
    getLiquidityPool: (liquidityTokenId: TokenId) => Promise<BN[]>;
    getPool: (liquidityTokenId: TokenId) => Promise<TPoolWithRatio>;
    getPools: () => Promise<TPoolWithRatio[]>;
    getTotalIssuanceOfTokens: () => Promise<TBalances>;
  };
  fee: {
    depositFromKusamaOrStatemine: (
      args: DepositFromKusamaOrStatemineFee
    ) => Promise<string>;
    depositFromParachain: (args: DepositFromParachainFee) => Promise<string>;
    withdraw: (args: WithdrawFee) => Promise<string>;
    withdrawKsm: (args: WithdrawKsmFee) => Promise<string>;
    activateLiquidity: (args: ActivateLiquidityFee) => Promise<string>;
    deactivateLiquidity: (args: DeactivateLiquidityFee) => Promise<string>;
    claimRewards: (args: ClaimRewardsFee) => Promise<string>;
    createPool: (args: CreatePoolFee) => Promise<string>;
    sellAsset: (args: SellAssetFee) => Promise<string>;
    buyAsset: (args: BuyAssetFee) => Promise<string>;
    mintLiquidity: (args: MintLiquidityFee) => Promise<string>;
    burnLiquidity: (args: BurnLiquidityFee) => Promise<string>;
    transferAllToken: (args: TransferAllFee) => Promise<string>;
    transferToken: (args: TransferTokenFee) => Promise<string>;
  };
  util: {
    calculateMintingFutureRewards: (
      liquidityTokenId: string,
      mintingAmount: BN,
      blocksToPass: BN
    ) => Promise<BN>;
  };
  api: () => Promise<ApiPromise>;
  batch: (args: Batch) => Promise<MangataGenericEvent[]>;
  batchAll: (args: Batch) => Promise<MangataGenericEvent[]>;
  forceBatch: (args: Batch) => Promise<MangataGenericEvent[]>;
}
