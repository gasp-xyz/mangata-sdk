import { BN } from '@polkadot/util';
import { KeyringPair } from '@polkadot/keyring/types';
import { Signer } from '@polkadot/api/types';
import { ISubmittableResult, Codec } from '@polkadot/types/types';
import { Event, Phase, MultiLocation } from '@polkadot/types/interfaces';
import * as bn_js from 'bn.js';
import { ApiPromise } from '@polkadot/api';
import { Object as Object$1 } from 'ts-toolbelt';

type ExtrinsicCommon = {
    account: Account;
    txOptions?: Partial<TxOptions>;
};
type Account = string | KeyringPair;
type TokenId = string;
type Amount = BN;
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

type Rewards = {
    address: Address;
    liquidityTokenId: TokenId;
};
type Reserve = {
    inputReserve: Amount;
    outputReserve: Amount;
    amount: Amount;
};
type Price = {
    firstTokenId: TokenId;
    secondTokenId: TokenId;
    amount: Amount;
};
type Liquidity = Object$1.Merge<ExtrinsicCommon, {
    liquidityTokenId: TokenId;
    amount: Amount;
}>;
type BurnLiquidity = Object$1.Merge<Object$1.Omit<Liquidity, "liquidityTokenId">, Price>;
type MintLiquidity = Object$1.Merge<Omit<BurnLiquidity, "amount">, {
    firstTokenAmount: Amount;
    expectedSecondTokenAmount: Amount;
}>;
type Asset = {
    soldTokenId: TokenId;
    boughtTokenId: TokenId;
    amount: Amount;
};
type MaxAmountIn = Object$1.Merge<Asset, {
    maxAmountIn: Amount;
}>;
type MinAmountOut = Object$1.Merge<Asset, {
    minAmountOut: Amount;
}>;
type BuyAsset = Object$1.Merge<ExtrinsicCommon, MaxAmountIn>;
type SellAsset = Object$1.Merge<ExtrinsicCommon, MinAmountOut>;
type Pool = {
    firstTokenId: TokenId;
    firstTokenAmount: Amount;
    secondTokenId: TokenId;
    secondTokenAmount: Amount;
};
type CreatePool = Object$1.Merge<ExtrinsicCommon, Pool>;

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
    Fungible: Amount;
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
type Deposit = Object$1.Merge<ExtrinsicCommon, {
    url: string;
    asset: XcmAsset;
    destination: XcmDestination;
    weight: string;
}>;
type Withdraw = Object$1.Merge<ExtrinsicCommon, {
    tokenSymbol: string;
    withWeight: string;
    parachainId: number;
    destinationAddress: Address;
    amount: Amount;
}>;
type RelayDeposit = Object$1.Merge<ExtrinsicCommon, {
    url: string;
    address: Address;
    amount: Amount;
    parachainId: number;
}>;
type RelayWithdraw = Object$1.Merge<ExtrinsicCommon, {
    kusamaAddress: Address;
    amount: Amount;
}>;

type TransferAllFee = Object$1.Omit<Transfer, "txOptions">;

type TransferTokenFee = Object$1.Merge<Object$1.Omit<Transfer, "txOptions">, {
    amount: Amount;
}>;

type BurnLiquidityFee = Object$1.Omit<BurnLiquidity, "txOptions">;

type MintLiquidityFee = Object$1.Omit<MintLiquidity, "txOptions">;

type BuyAssetFee = Object$1.Omit<BuyAsset, "txOptions">;

type SellAssetFee = Object$1.Omit<SellAsset, "txOptions">;

type CreatePoolFee = Object$1.Omit<CreatePool, "txOptions">;

type ClaimRewardsFee = Object$1.Omit<Liquidity, "txOptions">;

type DeactivateLiquidityFee = Object$1.Omit<Liquidity, "txOptions">;

type ActivateLiquidityFee = Object$1.Omit<Liquidity, "txOptions">;

type WithdrawFee = Object$1.Omit<Withdraw, "txOptions">;

declare const Mangata: {
    instance: (urls: string[]) => {
        apiPromise: Promise<ApiPromise>;
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
        query: {
            getNonce: (address: Address) => Promise<bn_js>;
            getLiquidityTokenId: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<bn_js>;
            getTotalIssuance: (tokenId: TokenId) => Promise<bn_js>;
            getTokenBalance: (address: Address, tokenId: TokenId) => Promise<TokenBalance>;
            getTokenInfo: (tokenId: TokenId) => Promise<TTokenInfo>;
            getLiquidityTokenIds: () => Promise<string[]>;
            getLiquidityTokens: () => Promise<TMainTokens>;
            getBlockNumber: () => Promise<string>;
            getOwnedTokens: (address: Address) => Promise<{
                [id: string]: TToken;
            } | null>;
            getAssetsInfo: () => Promise<TMainTokens>;
            getInvestedPools: (address: Address) => Promise<({
                firstTokenId: string;
                firstTokenAmount: bn_js;
                secondTokenId: string;
                secondTokenAmount: bn_js;
                liquidityTokenId: string;
                isPromoted: boolean;
            } & {
                share: bn_js;
                firstTokenRatio: bn_js;
                secondTokenRatio: bn_js;
                activatedLPTokens: bn_js;
                nonActivatedLPTokens: bn_js;
            })[]>;
            getAmountOfTokenIdInPool: (firstTokenId: TokenId, secondTokenId: TokenId) => Promise<bn_js[]>;
            getLiquidityPool: (liquidityTokenId: TokenId) => Promise<bn_js[]>;
            getPool: (liquidityTokenId: TokenId) => Promise<{
                firstTokenId: string;
                firstTokenAmount: bn_js;
                secondTokenId: string;
                secondTokenAmount: bn_js;
                liquidityTokenId: string;
                isPromoted: boolean;
                firstTokenRatio: bn_js;
                secondTokenRatio: bn_js;
            }>;
            getPools: () => Promise<{
                firstTokenId: string;
                firstTokenAmount: bn_js;
                secondTokenId: string;
                secondTokenAmount: bn_js;
                liquidityTokenId: string;
                isPromoted: boolean;
                firstTokenRatio: bn_js;
                secondTokenRatio: bn_js;
            }[]>;
            getTotalIssuanceOfTokens: () => Promise<TBalances>;
        };
        rpc: {
            calculateBuyPriceId: (args: Price) => Promise<bn_js>;
            calculateSellPriceId: (args: Price) => Promise<bn_js>;
            getBurnAmount: (args: Price) => Promise<any>;
            calculateSellPrice: (args: Reserve) => Promise<bn_js>;
            calculateBuyPrice: (args: Reserve) => Promise<bn_js>;
            calculateRewardsAmount: (args: Rewards) => Promise<bn_js>;
            getNodeVersion: () => Promise<string>;
            getNodeName: () => Promise<string>;
            getChain: () => Promise<string>;
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
        tokens: {
            transferAllTokens: (args: Transfer) => Promise<MangataGenericEvent[]>;
            transferTokens: (args: Transfer & {
                amount: Amount;
            }) => Promise<MangataGenericEvent[]>;
        };
        xTokens: {
            deposit: (args: Deposit) => Promise<void>;
            depositKsm: (args: RelayDeposit) => Promise<void>;
            withdraw: (args: Withdraw) => Promise<void>;
            withdrawKsm: (args: RelayWithdraw) => Promise<void>;
        };
    };
};

export { ExtrinsicCommon, Mangata };
