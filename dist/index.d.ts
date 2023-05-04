import { SubmittableExtrinsic, Signer } from '@polkadot/api/types';
import { ApiPromise } from '@polkadot/api';
import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { ISubmittableResult, Codec } from '@polkadot/types/types';
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
type Pool = {
    firstTokenId: TokenId;
    firstTokenAmount: TokenAmount;
    secondTokenId: TokenId;
    secondTokenAmount: TokenAmount;
};
type CreatePool = Merge<ExtrinsicCommon, Pool>;
type SellAssetFee = Except<SellAsset, "txOptions">;
type MintLiquidityFee = Except<MintLiquidity, "txOptions">;
type DeactivateLiquidityFee = Except<Liquidity, "txOptions">;
type CreatePoolFee = Except<CreatePool, "txOptions">;
type ClaimRewardsFee = Except<Liquidity, "txOptions">;
type BuyAssetFee = Except<BuyAsset, "txOptions">;
type BurnLiquidityFee = Except<BurnLiquidity, "txOptions">;
type ActivateLiquidityFee = Except<Liquidity, "txOptions">;

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
type TPool = Merge<Pool, {
    liquidityTokenId: TokenId;
    isPromoted: boolean;
}>;
type TPoolWithRatio = Merge<TPool, {
    firstTokenRatio: BN;
    secondTokenRatio: BN;
}>;

type XcmTxOptions = Partial<Omit<TxOptions, "statusCallback" | "extrinsicStatus">>;
type Deposit = Prettify<Merge<ExtrinsicCommon, {
    url: string;
    asset: any;
    destination: any;
    weightLimit: any;
}>>;
type Withdraw = Merge<ExtrinsicCommon, {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: TokenAmount;
}>;
type RelayDeposit = Prettify<Merge<ExtrinsicCommon, {
    url: string;
    assets: any;
    destination: any;
    feeAssetItem: any;
    beneficiary: any;
    weightLimit: any;
}>>;
type RelayWithdraw = Prettify<Merge<ExtrinsicCommon, {
    kusamaAddress: Address;
    amount: TokenAmount;
}>>;
type WithdrawKsmFee = Except<RelayWithdraw, "txOptions">;
type WithdrawFee = Except<Withdraw, "txOptions">;
type DepositFromParachainFee = Except<Deposit, "txOptions">;
type DepositFromKusamaOrStatemineFee = Except<RelayDeposit, "txOptions">;

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
    calls: SubmittableExtrinsic<"promise", ISubmittableResult>[];
}>;

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
type MangataSubmittableExtrinsic = SubmittableExtrinsic<"promise", ISubmittableResult>;
interface MangataInstance {
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
        transferTokens: (args: Transfer & {
            amount: TokenAmount;
        }) => Promise<MangataGenericEvent[]>;
    };
    submitableExtrinsic: {
        createPool: (args: CreatePool) => Promise<MangataSubmittableExtrinsic>;
        claimRewards: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;
        sellAsset: (args: SellAsset) => Promise<MangataSubmittableExtrinsic>;
        buyAsset: (args: BuyAsset) => Promise<MangataSubmittableExtrinsic>;
        mintLiquidity: (args: MintLiquidity) => Promise<MangataSubmittableExtrinsic>;
        burnLiquidity: (args: BurnLiquidity) => Promise<MangataSubmittableExtrinsic>;
        activateLiquidity: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;
        deactivateLiquidity: (args: Liquidity) => Promise<MangataSubmittableExtrinsic>;
        transferAllTokens: (args: Transfer) => Promise<MangataSubmittableExtrinsic>;
        transferTokens: (args: Transfer & {
            amount: TokenAmount;
        }) => Promise<MangataSubmittableExtrinsic>;
    };
    query: {
        getNonce: (address: Address) => Promise<BN>;
        getLiquidityTokenId: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<BN>;
        getTotalIssuance: (tokenId: TokenId) => Promise<BN>;
        getTokenBalance: (address: Address, tokenId: TokenId) => Promise<TokenBalance>;
        getTokenInfo: (tokenId: TokenId) => Promise<TTokenInfo>;
        getLiquidityTokenIds: () => Promise<string[]>;
        getLiquidityTokens: () => Promise<TMainTokens>;
        getBlockNumber: () => Promise<string>;
        getOwnedTokens: (address: Address) => Promise<{
            [id: TokenId]: Token;
        } | null>;
        getAssetsInfo: () => Promise<TMainTokens>;
        getInvestedPools: (address: Address) => Promise<(TPool & {
            share: BN;
            firstTokenRatio: BN;
            secondTokenRatio: BN;
            activatedLPTokens: BN;
            nonActivatedLPTokens: BN;
        })[]>;
        getAmountOfTokensInPool: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<BN[]>;
        getLiquidityPool: (liquidityTokenId: TokenId) => Promise<BN[]>;
        getPool: (liquidityTokenId: TokenId) => Promise<TPoolWithRatio>;
        getPools: () => Promise<TPoolWithRatio[]>;
        getTotalIssuanceOfTokens: () => Promise<TBalances>;
    };
    fee: {
        depositFromKusamaOrStatemine: (args: DepositFromKusamaOrStatemineFee) => Promise<string>;
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
        calculateMintingFutureRewards: (liquidityTokenId: string, mintingAmount: BN, blocksToPass: BN) => Promise<BN>;
    };
    api: () => Promise<ApiPromise>;
    batch: (args: Batch) => Promise<MangataGenericEvent[]>;
    batchAll: (args: Batch) => Promise<MangataGenericEvent[]>;
    forceBatch: (args: Batch) => Promise<MangataGenericEvent[]>;
}

declare const signTx: (api: ApiPromise, tx: SubmittableExtrinsic<"promise">, account: Account, txOptions?: Partial<TxOptions>) => Promise<MangataGenericEvent[]>;

declare function createMangataInstance(urls: string[]): MangataInstance;
declare const Mangata: {
    instance: typeof createMangataInstance;
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

export { Account, ActivateLiquidityFee, Address, Asset, BIG_BILLION, BIG_HUNDRED, BIG_HUNDRED_BILLIONS, BIG_HUNDRED_MILLIONS, BIG_HUNDRED_THOUSAND, BIG_MILLION, BIG_ONE, BIG_TEN, BIG_TEN_BILLIONS, BIG_TEN_MILLIONS, BIG_TEN_THOUSAND, BIG_THOUSAND, BIG_TRILLION, BIG_ZERO, BN_BILLION, BN_DIV_NUMERATOR_MULTIPLIER, BN_DIV_NUMERATOR_MULTIPLIER_DECIMALS, BN_HUNDRED, BN_HUNDRED_BILLIONS, BN_HUNDRED_MILLIONS, BN_HUNDRED_THOUSAND, BN_MILLION, BN_ONE, BN_TEN, BN_TEN_BILLIONS, BN_TEN_MILLIONS, BN_TEN_THOUSAND, BN_THOUSAND, BN_TRILLION, BN_ZERO, Batch, BurnLiquidity, BurnLiquidityFee, BuyAsset, BuyAssetFee, ClaimRewardsFee, CreatePool, CreatePoolFee, Database, DeactivateLiquidityFee, Deposit, DepositFromKusamaOrStatemineFee, DepositFromParachainFee, ErrorData, ExtrinsicCommon, Liquidity, Mangata, MangataEventData, MangataGenericEvent, MangataInstance, MangataSubmittableExtrinsic, MaxAmountIn, MinAmountOut, MintLiquidity, MintLiquidityFee, Pool, Prettify, Price, RelayDeposit, RelayWithdraw, Reserve, Rewards, SellAsset, SellAssetFee, TBalances, TMainTokens, TPool, TPoolWithRatio, TTokenInfo, Token, TokenAmount, TokenBalance, TokenId, TokenSymbol, Transfer, TransferAllFee, TransferTokenFee, TransferTokens, TxOptions, Withdraw, WithdrawFee, WithdrawKsmFee, XcmTxOptions, fromBN, signTx, toBN };
