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
  TPoolWithRatio,
  Token,
  TTokenInfo,
  TPoolWithShare,
  FeeLockType
} from "../types/query";
import {
  Deposit,
  DepositFromKusamaFee,
  DepositFromParachainFee,
  DepositFromStatemineFee,
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
  MultiswapBuyAsset,
  MultiswapSellAsset,
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
  /**
   * xTokens methods for interacting with various token-related operations.
   */
  xTokens: {
    /**
     * Deposits tokens from a parachain to Mangata.
     * @param The deposit parameters.
     * @returns A promise that resolves with void.
     */
    depositFromParachain: (args: Deposit) => Promise<void>;

    /**
     * Deposits Kusama tokens to Mangata.
     * @param args - The relay deposit parameters.
     * @returns A promise that resolves with void.
     */
    depositFromKusama: (args: RelayDeposit) => Promise<void>;

    /**
     * Deposits Statemine tokens to Mangata.
     * @param args - The relay deposit parameters.
     * @returns A promise that resolves with void.
     */
    depositFromStatemine: (args: RelayDeposit) => Promise<void>;

    /**
     * Withdraws tokens from Mangata.
     * @param args - The withdrawal parameters.
     * @returns A promise that resolves with void.
     */
    withdraw: (args: Withdraw) => Promise<void>;

    /**
     * Withdraws Kusama tokens from Mangata.
     * @param args - The relay withdrawal parameters.
     * @returns A promise that resolves with void.
     */
    withdrawKsm: (args: RelayWithdraw) => Promise<void>;
  };

  /**
   * xyk methods for interacting with XYK (Automated Market Maker) operations.
   */
  xyk: {
    /**
     * Deactivates liquidity in a pool.
     * @param args - The liquidity parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    deactivateLiquidity: (args: Liquidity) => Promise<MangataGenericEvent[]>;

    /**
     * Activates liquidity in a pool.
     * @param args - The liquidity parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    activateLiquidity: (args: Liquidity) => Promise<MangataGenericEvent[]>;

    /**
     * Burns liquidity tokens.
     * @param args - The burn liquidity parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    burnLiquidity: (args: BurnLiquidity) => Promise<MangataGenericEvent[]>;

    /**
     * Mints liquidity tokens.
     * @param args - The mint liquidity parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    mintLiquidity: (args: MintLiquidity) => Promise<MangataGenericEvent[]>;

    /**
     * Buys an asset from a pool.
     * @param args - The buy asset parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    buyAsset: (args: BuyAsset) => Promise<MangataGenericEvent[]>;

    /**
     * Sells an asset to a pool.
     * @param args - The sell asset parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    sellAsset: (args: SellAsset) => Promise<MangataGenericEvent[]>;

    /**
     * Creates a new pool.
     * @param args - The create pool parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    createPool: (args: CreatePool) => Promise<MangataGenericEvent[]>;

    /**
     * Claims rewards from a pool.
     * @param args - The liquidity parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    claimRewards: (args: Liquidity) => Promise<MangataGenericEvent[]>;

    /**
     * Executes a multiswap sell asset operation.
     * @param args - The multiswap sell asset parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    multiswapSellAsset: (
      args: MultiswapSellAsset
    ) => Promise<MangataGenericEvent[]>;

    /**
     * Executes a multiswap buy asset operation.
     * @param args - The multiswap buy asset parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    multiswapBuyAsset: (
      args: MultiswapBuyAsset
    ) => Promise<MangataGenericEvent[]>;
  };
  /**
   * rpc methods for interacting with various RPC operations.
   */
  rpc: {
    /**
     * Calculates the buy price based on the asset's ID.
     * @param args - The price parameters.
     * @returns A promise that resolves with a BN object.
     */
    calculateBuyPriceId: (args: Price) => Promise<BN>;

    /**
     * Calculates the sell price based on the asset's ID.
     * @param args - The price parameters.
     * @returns A promise that resolves with a BN object.
     */
    calculateSellPriceId: (args: Price) => Promise<BN>;

    /**
     * Retrieves the burn amount based on the price parameters.
     * @param args - The price parameters.
     * @returns A promise that resolves with any type of value.
     */
    getBurnAmount: (args: Price) => Promise<any>;

    /**
     * Calculates the sell price based on the reserve parameters.
     * @param args - The reserve parameters.
     * @returns A promise that resolves with a BN object.
     */
    calculateSellPrice: (args: Reserve) => Promise<BN>;

    /**
     * Calculates the buy price based on the reserve parameters.
     * @param args - The reserve parameters.
     * @returns A promise that resolves with a BN object.
     */
    calculateBuyPrice: (args: Reserve) => Promise<BN>;

    /**
     * Calculates the rewards amount based on the rewards parameters.
     * @param args - The rewards parameters.
     * @returns A promise that resolves with a BN object.
     */
    calculateRewardsAmount: (args: Rewards) => Promise<BN>;

    /**
     * Retrieves the version of the connected node.
     * @returns A promise that resolves with a string representing the node version.
     */
    getNodeVersion: () => Promise<string>;

    /**
     * Retrieves the name of the connected node.
     * @returns A promise that resolves with a string representing the node name.
     */
    getNodeName: () => Promise<string>;

    /**
     * Retrieves the name of the connected chain.
     * @returns A promise that resolves with a string representing the chain name.
     */
    getChain: () => Promise<string>;

    /**
     * Waits for a new block to be added, optionally specifying a block number to wait for.
     * @param blockNumber - The block number to wait for (optional).
     * @returns A promise that resolves with a boolean indicating if a new block was added.
     */
    waitForNewBlock: (blockNumber?: number) => Promise<boolean>;
  };
  /**
   * Methods for transferring tokens.
   */
  tokens: {
    /**
     * Transfers all tokens based on the transfer parameters.
     * @param args - The transfer parameters.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    transferAllTokens: (args: Transfer) => Promise<MangataGenericEvent[]>;

    /**
     * Transfers a specific amount of tokens based on the transfer parameters.
     * @param args - The transfer parameters, including the amount of tokens to transfer.
     * @returns A promise that resolves with an array of MangataGenericEvent objects.
     */
    transferTokens: (
      args: Transfer & { amount: TokenAmount }
    ) => Promise<MangataGenericEvent[]>;
  };
  /**
   * Methods for submitting extrinsics that perform actions on the blockchain. This methods are useful when using batch methods
   */
  submitableExtrinsic: {
    /**
     * Creates a pool based on the provided parameters.
     * @param args - The create pool parameters.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    createPool: (args: CreatePool) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Claims rewards based on the provided liquidity parameters.
     * @param args - The liquidity parameters for rewards claiming.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    claimRewards: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Sells an asset based on the provided parameters.
     * @param args - The sell asset parameters.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    sellAsset: (args: SellAsset) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Buys an asset based on the provided parameters.
     * @param args - The buy asset parameters.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    buyAsset: (args: BuyAsset) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Mints liquidity based on the provided parameters.
     * @param args - The mint liquidity parameters.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    mintLiquidity: (
      args: MintLiquidity
    ) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Burns liquidity based on the provided parameters.
     * @param args - The burn liquidity parameters.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    burnLiquidity: (
      args: BurnLiquidity
    ) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Activates liquidity based on the provided parameters.
     * @param args - The liquidity parameters for activation.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    activateLiquidity: (
      args: Liquidity
    ) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Deactivates liquidity based on the provided parameters.
     * @param args - The liquidity parameters for deactivation.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    deactivateLiquidity: (
      args: Liquidity
    ) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Transfers all tokens based on the transfer parameters.
     * @param args - The transfer parameters.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    transferAllTokens: (args: Transfer) => Promise<MangataSubmittableExtrinsic>;

    /**
     * Transfers a specific amount of tokens based on the transfer parameters.
     * @param args - The transfer parameters, including the amount of tokens to transfer.
     * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
     */
    transferTokens: (
      args: Transfer & { amount: TokenAmount }
    ) => Promise<MangataSubmittableExtrinsic>;
  };
  /**
   * Represents a set of query functions for retrieving information from the blockchain.
   */
  query: {
    /**
     * Retrieves the nonce of the specified address.
     */
    getNonce: (address: Address) => Promise<BN>;

    /**
     * Retrieves the liquidity token ID for a given pair of tokens.
     */
    getLiquidityTokenId: (
      firstTokenId: TokenId,
      secondTokenId: TokenId
    ) => Promise<BN>;

    /**
     * Retrieves the total issuance of a specific token.
     */
    getTotalIssuance: (tokenId: TokenId) => Promise<BN>;

    /**
     * Retrieves the token balance for a specific address and token ID.
     */
    getTokenBalance: (
      address: Address,
      tokenId: TokenId
    ) => Promise<TokenBalance>;

    /**
     * Retrieves detailed information about a specific token.
     */
    getTokenInfo: (tokenId: TokenId) => Promise<TTokenInfo>;

    /**
     * Retrieves the liquidity token IDs.
     */
    getLiquidityTokenIds: () => Promise<string[]>;

    /**
     * Retrieves the liquidity tokens.
     */
    getLiquidityTokens: () => Promise<TMainTokens>;

    /**
     * Retrieves the current block number.
     */
    getBlockNumber: () => Promise<string>;

    /**
     * Retrieves the tokens owned by a specific address.
     */
    getOwnedTokens: (
      address: Address
    ) => Promise<{ [id: TokenId]: Token } | null>;

    /**
     * Retrieves information about the main assets.
     */
    getAssetsInfo: () => Promise<TMainTokens>;

    /**
     * Retrieves the pools in which the specified address has invested.
     */
    getInvestedPools: (address: Address) => Promise<TPoolWithShare[]>;

    /**
     * Retrieves the amount of tokens in a liquidity pool for a given pair of tokens.
     */
    getAmountOfTokensInPool: (
      firstTokenId: TokenId,
      secondTokenId: TokenId
    ) => Promise<BN[]>;

    /**
     * Retrieves the liquidity pool information for a specific liquidity token ID.
     */
    getLiquidityPool: (liquidityTokenId: TokenId) => Promise<BN[]>;

    /**
     * Retrieves the detailed information about a specific pool.
     */
    getPool: (liquidityTokenId: TokenId) => Promise<TPoolWithRatio>;

    /**
     * Retrieves information about all the available pools.
     */
    getPools: () => Promise<TPoolWithRatio[]>;

    /**
     * Retrieves the total issuance of all tokens.
     */
    getTotalIssuanceOfTokens: () => Promise<TBalances>;

    getFeeLockMetadata: () => Promise<FeeLockType>;
  };
  /**
   * Represents a collection of fee calculation functions for different operations.
   */
  fee: {
    /**
     * Calculates the fee for depositing tokens from the Kusama network.
     */
    depositFromKusama: (args: DepositFromKusamaFee) => Promise<string>;

    /**
     * Calculates the fee for depositing tokens from the Statemine network.
     */
    depositFromStatemine: (args: DepositFromStatemineFee) => Promise<string>;

    /**
     * Calculates the fee for depositing tokens from a parachain.
     */
    depositFromParachain: (args: DepositFromParachainFee) => Promise<string>;

    /**
     * Calculates the fee for withdrawing tokens.
     */
    withdraw: (args: WithdrawFee) => Promise<string>;

    /**
     * Calculates the fee for withdrawing KSM (Kusama) tokens.
     */
    withdrawKsm: (args: WithdrawKsmFee) => Promise<string>;

    /**
     * Calculates the fee for activating liquidity in a pool.
     */
    activateLiquidity: (args: ActivateLiquidityFee) => Promise<string>;

    /**
     * Calculates the fee for deactivating liquidity in a pool.
     */
    deactivateLiquidity: (args: DeactivateLiquidityFee) => Promise<string>;

    /**
     * Calculates the fee for claiming rewards from a liquidity pool.
     */
    claimRewards: (args: ClaimRewardsFee) => Promise<string>;

    /**
     * Calculates the fee for creating a new pool.
     */
    createPool: (args: CreatePoolFee) => Promise<string>;

    /**
     * Calculates the fee for selling an asset.
     */
    sellAsset: (args: SellAssetFee) => Promise<string>;

    /**
     * Calculates the fee for buying an asset.
     */
    buyAsset: (args: BuyAssetFee) => Promise<string>;

    /**
     * Calculates the fee for minting liquidity in a pool.
     */
    mintLiquidity: (args: MintLiquidityFee) => Promise<string>;

    /**
     * Calculates the fee for burning liquidity in a pool.
     */
    burnLiquidity: (args: BurnLiquidityFee) => Promise<string>;

    /**
     * Calculates the fee for transferring all tokens.
     */
    transferAllToken: (args: TransferAllFee) => Promise<string>;

    /**
     * Calculates the fee for transferring tokens.
     */
    transferToken: (args: TransferTokenFee) => Promise<string>;
  };
  util: {
    /**
     * Calculates the future minting rewards for a given liquidity token based on the specified parameters.
     * @param liquidityTokenId - The ID of the liquidity token.
     * @param mintingAmount - The amount of tokens to be minted.
     * @param blocksToPass - The number of blocks to pass for calculating future rewards.
     * @returns A promise that resolves to the calculated future rewards amount.
     */
    calculateMintingFutureRewards: (
      liquidityTokenId: string,
      mintingAmount: BN,
      blocksToPass: BN
    ) => Promise<BN>;
  };
  /**
   * Represents a function that retrieves the API instance.
   * @returns A promise that resolves to the API instance.
   */
  api: () => Promise<ApiPromise>;
  /**
   * Represents a function that executes a batch operation.
   * @param args - The batch request object.
   * @returns A promise that resolves to an array of MangataGenericEvent objects.
   */
  batch: (args: Batch) => Promise<MangataGenericEvent[]>;
  /**
   * Represents a function that executes a batch operation for all items.
   * @param args - The batch request object.
   * @returns A promise that resolves to an array of MangataGenericEvent objects.
   */
  batchAll: (args: Batch) => Promise<MangataGenericEvent[]>;
  /**
   * Represents a function that forcefully executes a batch operation.
   * @param args - The batch request object.
   * @returns A promise that resolves to an array of MangataGenericEvent objects.
   */
  forceBatch: (args: Batch) => Promise<MangataGenericEvent[]>;
}
