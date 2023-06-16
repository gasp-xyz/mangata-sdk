import { Keyring } from "@polkadot/api";
import { BN } from "@polkadot/util";
import type { KeyringPair } from "@polkadot/keyring/types";
import { v4 as uuidv4 } from "uuid";

import type {
  MangataInstance,
  MangataGenericEvent,
  Address,
  TokenAmount
} from "../src";

export type Options = {
  user: KeyringPair;
  sudo: KeyringPair;
  amount: BN;
};

export type ExtrinsicData = {
  data: MangataGenericEvent[];
  searchTerms: string[];
};

export const createUser = (keyring: Keyring, name?: string) => {
  const user: string = name ? name : "//testUser_" + uuidv4();
  const account = keyring.createFromUri(user);
  keyring.addPair(account);
  return account;
};

export const getExtrinsicData = (result: ExtrinsicData) => {
  const { data, searchTerms } = result;
  return data.filter((e) => {
    return (
      e.method !== null &&
      searchTerms.every((filterTerm) =>
        (
          JSON.stringify(e.event.toHuman()) +
          JSON.stringify(e.event.toHuman().data)
        ).includes(filterTerm)
      )
    );
  });
};
export const createToken = async (
  instance: MangataInstance,
  address: Address,
  amount: TokenAmount
) => {
  const api = await instance.api();
  return api.tx.sudo.sudo(api.tx.tokens.create(address, amount));
};

export const createMangataToken = async (
  instance: MangataInstance,
  address: Address,
  amount: TokenAmount
) => {
  const api = await instance.api();
  return api.tx.sudo.sudo(api.tx.tokens.mint("0", address, amount));
};
