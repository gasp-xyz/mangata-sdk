import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";
import { Signer } from "@polkadot/api/types";
import type { ISubmittableResult, Codec } from "@polkadot/types/types";
import type { Event, Phase } from "@polkadot/types/interfaces";

export type ExtrinsicCommon = {
  account: Account;
  txOptions?: Partial<TxOptions>;
};
export interface Database {
  hasAddressNonce(address: string): boolean;
  setNonce(address: string, nonce: BN): void;
  getNonce(address: string): BN;
}
export type TErrorData = {
  Module?: {
    index?: string;
    error?: string;
  };
};
export type Account = string | KeyringPair;
export type TokenSymbol = string;
export type TokenId = string;
export type Amount = BN;
export type Address = string;
export type MangataEventData = {
  lookupName: string;
  data: Codec;
};
export type MangataGenericEvent = {
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
export type TxOptions = {
  nonce: BN;
  signer: Signer;
  statusCallback: (result: ISubmittableResult) => void;
  extrinsicStatus: (events: MangataGenericEvent[]) => void;
};
