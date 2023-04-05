/// <reference types="bn.js" />
import { BN } from '@polkadot/util';
export interface Database {
    hasAddressNonce(address: string): boolean;
    setNonce(address: string, nonce: BN): void;
    getNonce(address: string): BN;
}
//# sourceMappingURL=Database.d.ts.map