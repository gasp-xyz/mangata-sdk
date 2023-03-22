import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { Signer, SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult, Codec } from '@polkadot/types/types';
import { Event, Phase, MultiLocation } from '@polkadot/types/interfaces';
import { Merge, Except } from 'type-fest';
import { ApiPromise } from '@polkadot/api';

type ExtrinsicCommon = {
    account: Account;
    txOptions?: Partial<TxOptions>;
};
type Account = string | KeyringPair;
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

type Batch = Merge<ExtrinsicCommon, {
    calls: SubmittableExtrinsic<"promise", ISubmittableResult>[];
}>;

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
type MintLiquidity = Merge<Omit<BurnLiquidity, "amount">, {
    firstTokenAmount: TokenAmount;
    expectedSecondTokenAmount: TokenAmount;
}>;
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
type BuyAsset = Merge<ExtrinsicCommon, MaxAmountIn>;
type SellAsset = Merge<ExtrinsicCommon, MinAmountOut>;
type Pool = {
    firstTokenId: TokenId;
    firstTokenAmount: TokenAmount;
    secondTokenId: TokenId;
    secondTokenAmount: TokenAmount;
};
type CreatePool = Merge<ExtrinsicCommon, Pool>;

type Transfer = {
    account: Account;
    tokenId: TokenId;
    address: Address;
    txOptions?: Partial<TxOptions>;
};

type XcmAssetId = {
    Concrete: MultiLocation;
};
type XcmAssetFungibility = {
    Fungible: TokenAmount;
};
type XcmAsset = {
    V1: {
        id: XcmAssetId;
        fun: XcmAssetFungibility;
    };
};
type XcmInterior = {
    X2: [
        {
            Parachain: 2110;
        },
        {
            AccountId32: {
                network: "Any";
                id: `0x${string}`;
            };
        }
    ];
};
type XcmDestination = {
    V1: {
        parents: 1;
        interior: XcmInterior;
    };
};
type Deposit = Merge<ExtrinsicCommon, {
    url: string;
    asset: XcmAsset;
    destination: XcmDestination;
    weight: string;
}>;
type Withdraw = Merge<ExtrinsicCommon, {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: TokenAmount;
}>;
type RelayDeposit = Merge<ExtrinsicCommon, {
    url: string;
    address: Address;
    amount: TokenAmount;
    parachainId: number;
}>;
type RelayWithdraw = Merge<ExtrinsicCommon, {
    kusamaAddress: Address;
    amount: TokenAmount;
}>;

type TransferAllFee = Except<Transfer, "txOptions">;

type TransferTokenFee = Merge<Except<Transfer, "txOptions">, {
    amount: TokenAmount;
}>;

type BurnLiquidityFee = Except<BurnLiquidity, "txOptions">;

type MintLiquidityFee = Except<MintLiquidity, "txOptions">;

type BuyAssetFee = Except<BuyAsset, "txOptions">;

type SellAssetFee = Except<SellAsset, "txOptions">;

type CreatePoolFee = Except<CreatePool, "txOptions">;

type ClaimRewardsFee = Except<Liquidity, "txOptions">;

type DeactivateLiquidityFee = Except<Liquidity, "txOptions">;

type ActivateLiquidityFee = Except<Liquidity, "txOptions">;

type WithdrawFee = Except<Withdraw, "txOptions">;

type TToken = {
    id: TokenId;
    name: string;
    symbol: string;
    decimals: number;
    balance: TokenBalance;
};
type TTokenInfo = Omit<TToken, "balance">;
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

type MangataSubmittableExtrinsic = SubmittableExtrinsic<"promise", ISubmittableResult>;
interface MangataInstance {
    xTokens: {
        deposit: (args: Deposit) => Promise<void>;
        depositKsm: (args: RelayDeposit) => Promise<void>;
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
            [id: TokenId]: TToken;
        } | null>;
        getAssetsInfo: () => Promise<TMainTokens>;
        getInvestedPools: (address: Address) => Promise<(TPool & {
            share: BN;
            firstTokenRatio: BN;
            secondTokenRatio: BN;
            activatedLPTokens: BN;
            nonActivatedLPTokens: BN;
        })[]>;
        getAmountOfTokenIdInPool: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<BN[]>;
        getLiquidityPool: (liquidityTokenId: TokenId) => Promise<BN[]>;
        getPool: (liquidityTokenId: TokenId) => Promise<TPoolWithRatio>;
        getPools: () => Promise<TPoolWithRatio[]>;
        getTotalIssuanceOfTokens: () => Promise<TBalances>;
    };
    fee: {
        withdraw: (args: WithdrawFee) => Promise<string>;
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
    apiPromise: Promise<ApiPromise>;
    batch: (args: Batch) => Promise<MangataGenericEvent[]>;
    batchAll: (args: Batch) => Promise<MangataGenericEvent[]>;
    forceBatch: (args: Batch) => Promise<MangataGenericEvent[]>;
}
declare function createMangataInstance(urls: string[]): MangataInstance;
declare const Mangata: {
    instance: typeof createMangataInstance;
};

export { Batch, ExtrinsicCommon, Mangata };
