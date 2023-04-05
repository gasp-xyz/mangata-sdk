import { BN } from "@polkadot/util";
import { Database } from "../types/Database";
declare class InMemoryDatabase implements Database {
    static instance: InMemoryDatabase;
    private db;
    private constructor();
    static getInstance(): InMemoryDatabase;
    hasAddressNonce: (address: string) => boolean;
    setNonce: (address: string, nonce: BN) => void;
    getNonce: (address: string) => BN;
}
export declare const sleep: (ms: number) => Promise<unknown>;
export declare const instance: InMemoryDatabase;
export {};
//# sourceMappingURL=MemoryDatabase.d.ts.map