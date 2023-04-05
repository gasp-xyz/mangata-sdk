/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
export declare class Rpc {
    static getChain(api: ApiPromise): Promise<string>;
    static getNodeName(api: ApiPromise): Promise<string>;
    static getNodeVersion(api: ApiPromise): Promise<string>;
    static calculateRewardsAmount(api: ApiPromise, address: string, liquidityTokenId: string): Promise<BN>;
    static calculateBuyPrice(api: ApiPromise, inputReserve: BN, outputReserve: BN, amount: BN): Promise<BN>;
    static calculateSellPrice(api: ApiPromise, inputReserve: BN, outputReserve: BN, amount: BN): Promise<BN>;
    static getBurnAmount(api: ApiPromise, firstTokenId: string, secondTokenId: string, amount: BN): Promise<any>;
    static calculateSellPriceId(api: ApiPromise, firstTokenId: string, secondTokenId: string, amount: BN): Promise<BN>;
    static calculateBuyPriceId(api: ApiPromise, firstTokenId: string, secondTokenId: string, amount: BN): Promise<BN>;
}
//# sourceMappingURL=Rpc.d.ts.map