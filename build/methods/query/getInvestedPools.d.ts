/// <reference types="bn.js" />
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Address } from "../../types/common";
export declare const getInvestedPools: (instancePromise: Promise<ApiPromise>, address: Address) => Promise<({
    firstTokenId: string;
    firstTokenAmount: BN;
    secondTokenId: string;
    secondTokenAmount: BN;
    liquidityTokenId: string;
    isPromoted: boolean;
} & {
    share: BN;
    firstTokenRatio: BN;
    secondTokenRatio: BN;
    activatedLPTokens: BN;
    nonActivatedLPTokens: BN;
})[]>;
//# sourceMappingURL=getInvestedPools.d.ts.map