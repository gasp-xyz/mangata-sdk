/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { BN } from "@polkadot/util";
import { DepositXcmTuple, WithdrawXcmTuple } from "../types/AssetInfo";
export declare class Fee {
    static sendTokenFromParachainToMangataFee(...args: DepositXcmTuple): Promise<string>;
    static sendTokenFromMangataToParachainFee(...args: WithdrawXcmTuple): Promise<string>;
    /**
     * @deprecated
     */
    static sendTurTokenFromTuringToMangataFee(api: ApiPromise, turingUrl: string, account: string | KeyringPair, mangataAddress: string, amount: BN): Promise<string>;
    /**
     * @deprecated
     */
    static sendTurTokenFromMangataToTuringFee(api: ApiPromise, mangataAccount: string | KeyringPair, destinationAddress: string, amount: BN): Promise<string>;
    static sendKusamaTokenFromRelayToParachainFee(kusamaEndpointUrl: string, ksmAccount: string | KeyringPair, destinationMangataAddress: string, amount: BN, parachainId: number): Promise<string>;
    static sendKusamaTokenFromParachainToRelayFee(api: ApiPromise, mangataAccount: string | KeyringPair, destinationKusamaAddress: string, amount: BN): Promise<string>;
    static activateLiquidity(api: ApiPromise, account: string | KeyringPair, liquditityTokenId: string, amount: BN): Promise<string>;
    static deactivateLiquidity(api: ApiPromise, account: string | KeyringPair, liquditityTokenId: string, amount: BN): Promise<string>;
    static claimRewardsFee(api: ApiPromise, account: string | KeyringPair, liquidityTokenId: string, amount: BN): Promise<string>;
    static createPoolFee(api: ApiPromise, account: string | KeyringPair, firstTokenId: string, firstTokenAmount: BN, secondTokenId: string, secondTokenAmount: BN): Promise<string>;
    static sellAssetFee(api: ApiPromise, account: string | KeyringPair, soldTokenId: string, boughtTokenId: string, amount: BN, minAmountOut: BN): Promise<string>;
    static buyAssetFee(api: ApiPromise, account: string | KeyringPair, soldTokenId: string, boughtTokenId: string, amount: BN, maxAmountIn: BN): Promise<string>;
    static mintLiquidityFee(api: ApiPromise, account: string | KeyringPair, firstTokenId: string, secondTokenId: string, firstTokenAmount: BN, expectedSecondTokenAmount?: BN): Promise<string>;
    static burnLiquidityFee(api: ApiPromise, account: string | KeyringPair, firstTokenId: string, secondTokenId: string, liquidityTokenAmount: BN): Promise<string>;
    static transferTokenFee(api: ApiPromise, account: string | KeyringPair, tokenId: string, address: string, amount: BN): Promise<string>;
    static transferAllTokenFee(api: ApiPromise, account: string | KeyringPair, tokenId: string, address: string): Promise<string>;
}
//# sourceMappingURL=Fee.d.ts.map