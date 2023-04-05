/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
type TLiquidityTokens = {
    [identificator: string]: string;
};
export declare const getPoolsBalance: (api: ApiPromise, liquidityAssets: TLiquidityTokens) => Promise<{
    [identificator: string]: BN[];
}>;
export {};
//# sourceMappingURL=getPoolsBalance.d.ts.map