import { Keyring } from "@polkadot/api";
import { BN } from "@polkadot/util";
import type { KeyringPair } from "@polkadot/keyring/types";
import { v4 as uuidv4 } from "uuid";

import type { MangataInstance, MangataGenericEvent } from "../src";
import { signTx } from "../src";

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

export const createToken = async (instance: MangataInstance, args: Options) => {
  const { user, sudo, amount } = args;
  const api = await instance.apiPromise;
  const nonce = await instance.query.getNonce(sudo.address);
  const tx = api.tx.sudo.sudo(api.tx.tokens.create(user.address, amount));
  const txOptions = { nonce };
  const data = await signTx(api, tx, sudo, txOptions);
  const searchTerms = ["tokens", "Issued", user.address];
  const extrinsicData = getExtrinsicData({ data, searchTerms });

  return extrinsicData?.eventData[0].data.toString();
};

export const getExtrinsicData = (result: ExtrinsicData) => {
  const { data, searchTerms } = result;
  return data.find((e) => {
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

export const createMangataToken = async (
  instance: MangataInstance,
  args: Options
) => {
  const { user, sudo, amount } = args;
  const api = await instance.apiPromise;
  const nonce = await instance.query.getNonce(sudo.address);
  const tx = api.tx.sudo.sudo(api.tx.tokens.mint("0", user.address, amount));
  const txOptions = { nonce };
  await signTx(api, tx, sudo, txOptions);
};
