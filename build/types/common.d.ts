/// <reference types="bn.js" />
import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";
import { Signer } from "@polkadot/api/types";
import type { ISubmittableResult, Codec } from "@polkadot/types/types";
import type { Event, Phase } from "@polkadot/types/interfaces";
export declare type ExtrinsicCommon = {
    account: Account;
    txOptions?: Partial<TxOptions>;
};
export interface Database {
    hasAddressNonce(address: string): boolean;
    setNonce(address: string, nonce: BN): void;
    getNonce(address: string): BN;
}
export declare type TErrorData = {
    Module?: {
        index?: string;
        error?: string;
    };
};
export declare type Account = string | KeyringPair;
export declare type TokenSymbol = string;
export declare type TokenId = string;
export declare type Amount = BN;
export declare type Address = string;
export declare type MangataEventData = {
    lookupName: string;
    data: Codec;
};
export declare type MangataGenericEvent = {
    event: Event;
    phase: Phase;
    section: string;
    method: string;
    metaDocumentation: string;
    eventData: MangataEventData[];
    error: {
        documentation: string[];
        name: string;
    } | null;
};
export declare type TxOptions = {
    nonce: BN;
    signer: Signer;
    statusCallback: (result: ISubmittableResult) => void;
    extrinsicStatus: (events: MangataGenericEvent[]) => void;
};
//# sourceMappingURL=common.d.ts.map