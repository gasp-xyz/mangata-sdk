/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenId } from "../../types/common";
export declare const getPool: (instancePromise: Promise<ApiPromise>, liquidityTokenId: TokenId) => Promise<{
    firstTokenId: string;
    firstTokenAmount: BN;
    secondTokenId: string;
    secondTokenAmount: BN;
    liquidityTokenId: string;
    isPromoted: boolean;
    firstTokenRatio: BN;
    secondTokenRatio: BN;
}>;
//# sourceMappingURL=getPool.d.ts.map