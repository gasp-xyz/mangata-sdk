/// <reference types="bn.js" />
import { Keyring } from "@polkadot/api";
import { KeypairType } from "@polkadot/util-crypto/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { BN } from "@polkadot/util";
/**
 * @class MangataHelpers
 * @author Mangata Finance
 */
export declare class MangataHelpers {
    static createKeyring(type: KeypairType): Keyring;
    static createKeyPairFromName(keyring: Keyring, name?: string): KeyringPair;
    static getPriceImpact(poolBalance: {
        firstTokenBalance: BN;
        secondTokenBalance: BN;
    }, poolDecimals: {
        firstTokenDecimals: number;
        secondTokenDecimals: number;
    }, firstTokenAmount: string, secondTokenAmount: string): string | undefined;
}
//# sourceMappingURL=MangataHelpers.d.ts.map