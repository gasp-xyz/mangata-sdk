import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ApiPromise } from "@polkadot/api";
import { Account, MangataGenericEvent, TxOptions } from "./types/common";
export declare const signTx: (api: ApiPromise, tx: SubmittableExtrinsic<"promise">, account: Account, txOptions?: Partial<TxOptions> | undefined) => Promise<MangataGenericEvent[]>;
//# sourceMappingURL=signTx.d.ts.map