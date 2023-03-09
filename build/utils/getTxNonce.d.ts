import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TxOptions } from "../types/common";
export declare const getTxNonce: (api: ApiPromise, address: string, txOptions?: Partial<TxOptions> | undefined) => Promise<BN>;
//# sourceMappingURL=getTxNonce.d.ts.map