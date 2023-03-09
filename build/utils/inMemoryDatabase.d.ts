import { BN } from "@polkadot/util";
import { Database } from "../types/common";
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
export declare const dbInstance: InMemoryDatabase;
export {};
//# sourceMappingURL=inMemoryDatabase.d.ts.map