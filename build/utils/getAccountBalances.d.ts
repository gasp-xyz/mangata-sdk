import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
export declare const getAccountBalances: (api: ApiPromise, address: string) => Promise<{
    [id: string]: {
        free: BN;
        frozen: BN;
        reserved: BN;
    };
}>;
//# sourceMappingURL=getAccountBalances.d.ts.map