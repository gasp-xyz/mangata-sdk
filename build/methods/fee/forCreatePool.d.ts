import { ApiPromise } from "@polkadot/api";
import { CreatePool } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type CreatePoolFee = Object.Omit<CreatePool, "txOptions">;
export declare const forCreatePool: (instancePromise: Promise<ApiPromise>, args: CreatePoolFee) => Promise<string>;
//# sourceMappingURL=forCreatePool.d.ts.map