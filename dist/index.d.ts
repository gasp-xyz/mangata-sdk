import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { Codec, ISubmittableResult } from '@polkadot/types/types';
import { Event, Phase } from '@polkadot/types/interfaces';
import { Merge, Except } from 'type-fest';
import Big from 'big.js';

type Rewards = {
    address: Address;
    liquidityTokenId: TokenId;
};
type Reserve = {
    inputReserve: TokenAmount;
    outputReserve: TokenAmount;
    amount: TokenAmount;
};
type Price = {
    firstTokenId: TokenId;
    secondTokenId: TokenId;
    amount: TokenAmount;
};
type Liquidity = Merge<ExtrinsicCommon, {
    liquidityTokenId: TokenId;
    amount: TokenAmount;
}>;
type BurnLiquidity = Merge<Except<Liquidity, "liquidityTokenId">, Price>;
type MintLiquidity = Prettify<Merge<Omit<BurnLiquidity, "amount">, {
    firstTokenAmount: TokenAmount;
    expectedSecondTokenAmount: TokenAmount;
}>>;
type Asset = {
    soldTokenId: TokenId;
    boughtTokenId: TokenId;
    amount: TokenAmount;
};
type MaxAmountIn = Merge<Asset, {
    maxAmountIn: TokenAmount;
}>;
type MinAmountOut = Merge<Asset, {
    minAmountOut: TokenAmount;
}>;
type BuyAsset = Prettify<Merge<ExtrinsicCommon, MaxAmountIn>>;
type SellAsset = Prettify<Merge<ExtrinsicCommon, MinAmountOut>>;
type PoolBase = {
    firstTokenId: TokenId;
    firstTokenAmount: TokenAmount;
    secondTokenId: TokenId;
    secondTokenAmount: TokenAmount;
};
type CreatePool = Merge<ExtrinsicCommon, PoolBase>;
type SellAssetFee = Except<SellAsset, "txOptions">;
type MintLiquidityFee = Except<MintLiquidity, "txOptions">;
type DeactivateLiquidityFee = Except<Liquidity, "txOptions">;
type CreatePoolFee = Except<CreatePool, "txOptions">;
type ClaimRewardsFee = Except<Omit<Liquidity, "amount">, "txOptions">;
type BuyAssetFee = Except<BuyAsset, "txOptions">;
type BurnLiquidityFee = Except<BurnLiquidity, "txOptions">;
type ActivateLiquidityFee = Except<Liquidity, "txOptions">;
type MultiSwapBase = Merge<ExtrinsicCommon, {
    tokenIds: TokenId[];
    amount: TokenAmount;
}>;
type MultiswapSellAsset = Merge<MultiSwapBase, {
    minAmountOut: TokenAmount;
}>;
type MultiswapBuyAsset = Merge<MultiSwapBase, {
    maxAmountIn: TokenAmount;
}>;

type Token = {
    id: TokenId;
    name: string;
    symbol: string;
    decimals: number;
    balance: TokenBalance;
};
type TTokenInfo = Omit<Token, "balance">;
type TBalances = Record<TokenId, BN>;
type TMainTokens = Record<TokenId, TTokenInfo>;
type TokenBalance = {
    free: BN;
    reserved: BN;
    frozen: BN;
};
type Pool = Merge<PoolBase, {
    liquidityTokenId: TokenId;
    isPromoted: boolean;
}>;
type TPoolWithRatio = Merge<Pool, {
    firstTokenRatio: BN;
    secondTokenRatio: BN;
}>;
type TPoolWithShare = Pool & {
    share: BN;
    firstTokenRatio: BN;
    secondTokenRatio: BN;
    activatedLPTokens: BN;
    nonActivatedLPTokens: BN;
};
type FeeLockType = {
    periodLength: string;
    feeLockAmount: string;
    swapValueThreshold: string;
    whitelistedTokens: number[];
};

type XcmTxOptions = Partial<Omit<TxOptions, "statusCallback" | "extrinsicStatus">>;
type Deposit<A = unknown, D = unknown, W = unknown> = Prettify<Merge<ExtrinsicCommon, {
    url: string;
    asset: A;
    destination: D;
    weightLimit: W;
}>>;
type Withdraw = Merge<ExtrinsicCommon, {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: TokenAmount;
}>;
type RelayDeposit<A = unknown, D = unknown, F = number, B = unknown, W = unknown> = Prettify<Merge<ExtrinsicCommon, {
    url: string;
    assets: A;
    destination: D;
    feeAssetItem: F;
    beneficiary: B;
    weightLimit: W;
}>>;
type RelayWithdraw = Prettify<Merge<ExtrinsicCommon, {
    kusamaAddress: Address;
    amount: TokenAmount;
}>>;
type WithdrawKsmFee = Except<RelayWithdraw, "txOptions">;
type WithdrawFee = Except<Withdraw, "txOptions">;
type DepositFromParachainFee = Except<Deposit, "txOptions">;
type DepositFromKusamaFee = Except<RelayDeposit, "txOptions">;
type DepositFromStatemineFee = Except<RelayDeposit, "txOptions">;

type Transfer = {
    account: Account;
    tokenId: TokenId;
    address: Address;
    txOptions?: Partial<TxOptions>;
};
type TransferTokens = Merge<Transfer, {
    amount: TokenAmount;
}>;
type TransferTokenFee = Merge<Except<Transfer, "txOptions">, {
    amount: TokenAmount;
}>;
type TransferAllFee = Except<Transfer, "txOptions">;

type Batch = Merge<ExtrinsicCommon, {
    calls: MangataSubmittableExtrinsic[];
}>;
type PoolReserves = [BN, BN];
type TokenAmounts = [string, string];
type TokenDecimals = [number, number];
type PriceImpact = {
    poolReserves: PoolReserves;
    decimals: TokenDecimals;
    tokenAmounts: TokenAmounts;
};

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type ExtrinsicCommon = {
    account: Account;
    txOptions?: Partial<TxOptions>;
};
interface Database {
    hasAddressNonce(address: string): boolean;
    setNonce(address: string, nonce: BN): void;
    getNonce(address: string): BN;
}
type ErrorData = {
    Module?: {
        index?: string;
        error?: string;
    };
};
type Account = string | KeyringPair;
type TokenSymbol = string;
type TokenId = string;
type TokenAmount = BN;
type Address = string;
type MangataEventData = {
    lookupName: string;
    data: Codec;
};
type MangataGenericEvent = {
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
type TxOptions = {
    nonce: BN;
    signer: Signer;
    statusCallback: (result: ISubmittableResult) => void;
    extrinsicStatus: (events: MangataGenericEvent[]) => void;
};
type MangataSubmittableExtrinsic = SubmittableExtrinsic<"promise">;
interface MangataInstance {
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
        claimRewards: (args: Omit<Liquidity, "amount">) => Promise<MangataGenericEvent[]>;
        /**
         * Executes a multiswap sell asset operation.
         * @param args - The multiswap sell asset parameters.
         * @returns A promise that resolves with an array of MangataGenericEvent objects.
         */
        multiswapSellAsset: (args: MultiswapSellAsset) => Promise<MangataGenericEvent[]>;
        /**
         * Executes a multiswap buy asset operation.
         * @param args - The multiswap buy asset parameters.
         * @returns A promise that resolves with an array of MangataGenericEvent objects.
         */
        multiswapBuyAsset: (args: MultiswapBuyAsset) => Promise<MangataGenericEvent[]>;
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
        calculateBuyPriceId: (soldTokenId: TokenId, boughtTokenId: TokenId, amount: TokenAmount) => Promise<BN>;
        /**
         * Calculates the sell price based on the asset's ID.
         * @param args - The price parameters.
         * @returns A promise that resolves with a BN object.
         */
        calculateSellPriceId: (soldTokenId: TokenId, boughtTokenId: TokenId, amount: TokenAmount) => Promise<BN>;
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
        transferTokens: (args: Transfer & {
            amount: TokenAmount;
        }) => Promise<MangataGenericEvent[]>;
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
        claimRewards: (args: Omit<Liquidity, "amount">) => Promise<MangataSubmittableExtrinsic>;
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
        mintLiquidity: (args: MintLiquidity) => Promise<MangataSubmittableExtrinsic>;
        /**
         * Burns liquidity based on the provided parameters.
         * @param args - The burn liquidity parameters.
         * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
         */
        burnLiquidity: (args: BurnLiquidity) => Promise<MangataSubmittableExtrinsic>;
        /**
         * Activates liquidity based on the provided parameters.
         * @param args - The liquidity parameters for activation.
         * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
         */
        activateLiquidity: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;
        /**
         * Deactivates liquidity based on the provided parameters.
         * @param args - The liquidity parameters for deactivation.
         * @returns A promise that resolves with a MangataSubmittableExtrinsic object.
         */
        deactivateLiquidity: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;
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
        transferTokens: (args: Transfer & {
            amount: TokenAmount;
        }) => Promise<MangataSubmittableExtrinsic>;
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
        getLiquidityTokenId: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<BN>;
        /**
         * Retrieves the total issuance of a specific token.
         */
        getTotalIssuance: (tokenId: TokenId) => Promise<BN>;
        /**
         * Retrieves the token balance for a specific address and token ID.
         */
        getTokenBalance: (tokenId: TokenId, address: Address) => Promise<TokenBalance>;
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
        getOwnedTokens: (address: Address) => Promise<{
            [id: TokenId]: Token;
        } | null>;
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
        getAmountOfTokensInPool: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<BN[]>;
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
        getUrls: () => string[];
        /**
         * Calculates the future minting rewards for a given liquidity token based on the specified parameters.
         * @param liquidityTokenId - The ID of the liquidity token.
         * @param mintingAmount - The amount of tokens to be minted.
         * @param blocksToPass - The number of blocks to pass for calculating future rewards.
         * @returns A promise that resolves to the calculated future rewards amount.
         */
        calculateMintingFutureRewards: (liquidityTokenId: string, mintingAmount: BN, blocksToPass: BN) => Promise<BN>;
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

declare const signTx: (api: ApiPromise, tx: SubmittableExtrinsic<"promise">, account: Account, txOptions?: Partial<TxOptions>) => Promise<MangataGenericEvent[]>;

/**
 * Creates a MangataInstance object with various methods for interacting with the Mangata node.
 * @param urls - An array of URLs for connecting to the Mangata node.
 * @returns A MangataInstance object.
 */
declare function createMangataInstance(urls: string[]): MangataInstance;
declare const Mangata: {
    instance: typeof createMangataInstance;
    getPriceImpact: (args: PriceImpact) => string | undefined;
};

declare const BIG_ZERO: Big;
declare const BIG_ONE: Big;
declare const BIG_TEN: Big;
declare const BIG_HUNDRED: Big;
declare const BIG_THOUSAND: Big;
declare const BIG_TEN_THOUSAND: Big;
declare const BIG_HUNDRED_THOUSAND: Big;
declare const BIG_MILLION: Big;
declare const BIG_TEN_MILLIONS: Big;
declare const BIG_HUNDRED_MILLIONS: Big;
declare const BIG_BILLION: Big;
declare const BIG_TEN_BILLIONS: Big;
declare const BIG_HUNDRED_BILLIONS: Big;
declare const BIG_TRILLION: Big;

declare const BN_ZERO: BN;
declare const BN_ONE: BN;
declare const BN_TEN: BN;
declare const BN_HUNDRED: BN;
declare const BN_THOUSAND: BN;
declare const BN_TEN_THOUSAND: BN;
declare const BN_HUNDRED_THOUSAND: BN;
declare const BN_MILLION: BN;
declare const BN_TEN_MILLIONS: BN;
declare const BN_HUNDRED_MILLIONS: BN;
declare const BN_BILLION: BN;
declare const BN_TEN_BILLIONS: BN;
declare const BN_HUNDRED_BILLIONS: BN;
declare const BN_TRILLION: BN;
declare const BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS = 18;
declare const BN_DIV_NUMERATOR_MULTIPLIER: BN;

declare const toBN: (value: string, exponent?: number) => BN;
declare const fromBN: (value: BN, exponent?: number) => string;

declare const toFixed: (value: string, decimals: number) => string;

declare const isBuyAssetTransactionSuccessful: (events: MangataGenericEvent[]) => boolean;

declare const isSellAssetTransactionSuccessful: (events: MangataGenericEvent[]) => boolean;

export { Account, ActivateLiquidityFee, Address, Asset, BIG_BILLION, BIG_HUNDRED, BIG_HUNDRED_BILLIONS, BIG_HUNDRED_MILLIONS, BIG_HUNDRED_THOUSAND, BIG_MILLION, BIG_ONE, BIG_TEN, BIG_TEN_BILLIONS, BIG_TEN_MILLIONS, BIG_TEN_THOUSAND, BIG_THOUSAND, BIG_TRILLION, BIG_ZERO, BN_BILLION, BN_DIV_NUMERATOR_MULTIPLIER, BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS, BN_HUNDRED, BN_HUNDRED_BILLIONS, BN_HUNDRED_MILLIONS, BN_HUNDRED_THOUSAND, BN_MILLION, BN_ONE, BN_TEN, BN_TEN_BILLIONS, BN_TEN_MILLIONS, BN_TEN_THOUSAND, BN_THOUSAND, BN_TRILLION, BN_ZERO, Batch, BurnLiquidity, BurnLiquidityFee, BuyAsset, BuyAssetFee, ClaimRewardsFee, CreatePool, CreatePoolFee, Database, DeactivateLiquidityFee, Deposit, DepositFromKusamaFee, DepositFromParachainFee, DepositFromStatemineFee, ErrorData, ExtrinsicCommon, FeeLockType, Liquidity, Mangata, MangataEventData, MangataGenericEvent, MangataInstance, MangataSubmittableExtrinsic, MaxAmountIn, MinAmountOut, MintLiquidity, MintLiquidityFee, MultiSwapBase, MultiswapBuyAsset, MultiswapSellAsset, Pool, PoolBase, PoolReserves, Prettify, Price, PriceImpact, RelayDeposit, RelayWithdraw, Reserve, Rewards, SellAsset, SellAssetFee, TBalances, TMainTokens, TPoolWithRatio, TPoolWithShare, TTokenInfo, Token, TokenAmount, TokenAmounts, TokenBalance, TokenDecimals, TokenId, TokenSymbol, Transfer, TransferAllFee, TransferTokenFee, TransferTokens, TxOptions, Withdraw, WithdrawFee, WithdrawKsmFee, XcmTxOptions, fromBN, isBuyAssetTransactionSuccessful, isSellAssetTransactionSuccessful, signTx, toBN, toFixed };
