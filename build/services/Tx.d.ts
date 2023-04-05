/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { BN } from "@polkadot/util";
import { TxOptions, XcmTxOptions } from "../types/TxOptions";
import { MangataGenericEvent } from "../types/MangataGenericEvent";
import { DepositXcmTuple, WithdrawXcmTuple } from "../types/AssetInfo";
export declare const signTx: (api: ApiPromise, tx: SubmittableExtrinsic<"promise">, account: string | KeyringPair, txOptions?: TxOptions) => Promise<MangataGenericEvent[]>;
export declare class Tx {
    static sendKusamaTokenFromRelayToParachain(kusamaEndpointUrl: string, ksmAccount: string | KeyringPair, destinationMangataAddress: string, amount: BN, parachainId: number, txOptions?: XcmTxOptions): Promise<void>;
    static sendKusamaTokenFromParachainToRelay(api: ApiPromise, mangataAccount: string | KeyringPair, destinationKusamaAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    static sendTokenFromStatemineToMangata(...args: DepositXcmTuple): Promise<void>;
    static sendTokenFromParachainToMangata(...args: DepositXcmTuple): Promise<void>;
    static sendTokenFromMangataToParachain(...args: WithdrawXcmTuple): Promise<void>;
    static sendTurTokenFromTuringToMangata(api: ApiPromise, turingUrl: string, account: string | KeyringPair, mangataAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    static sendTurTokenFromMangataToTuring(api: ApiPromise, mangataAccount: string | KeyringPair, destinationAddress: string, amount: BN, txOptions?: XcmTxOptions): Promise<void>;
    static activateLiquidity(api: ApiPromise, account: string | KeyringPair, liquditityTokenId: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static deactivateLiquidity(api: ApiPromise, account: string | KeyringPair, liquditityTokenId: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static claimRewards(api: ApiPromise, account: string | KeyringPair, liquidityTokenId: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static createPool(api: ApiPromise, account: string | KeyringPair, firstTokenId: string, firstTokenAmount: BN, secondTokenId: string, secondTokenAmount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static sellAsset(api: ApiPromise, account: string | KeyringPair, soldTokenId: string, boughtTokenId: string, amount: BN, minAmountOut: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static buyAsset(api: ApiPromise, account: string | KeyringPair, soldTokenId: string, boughtTokenId: string, amount: BN, maxAmountIn: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static mintLiquidity(api: ApiPromise, account: string | KeyringPair, firstTokenId: string, secondTokenId: string, firstTokenAmount: BN, expectedSecondTokenAmount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static burnLiquidity(api: ApiPromise, account: string | KeyringPair, firstTokenId: string, secondTokenId: string, liquidityTokenAmount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static transferToken(api: ApiPromise, account: string | KeyringPair, tokenId: string, address: string, amount: BN, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
    static transferAllToken(api: ApiPromise, account: string | KeyringPair, tokenId: string, address: string, txOptions?: TxOptions): Promise<MangataGenericEvent[]>;
}
//# sourceMappingURL=Tx.d.ts.map