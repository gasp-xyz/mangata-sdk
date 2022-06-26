import { KeyringPair } from "@polkadot/keyring/types";
import { BN } from "@polkadot/util";

import { signTx } from "../index";
import { instance } from "./instanceCreation";
import { MangataGenericEvent } from "../src/types/MangataGenericEvent";

export enum ExtrinsicResult {
  ExtrinsicSuccess,
  ExtrinsicFailed,
  ExtrinsicUndefined
}

export const createTokenForUser = async (
  user: KeyringPair,
  sudo: KeyringPair,
  amount: BN
): Promise<BN> => {
  const api = await instance.getApi();
  await instance.waitForNewBlock(2);
  const nonce = await instance.getNonce(sudo.address);
  const result = await signTx(
    api,
    api.tx.sudo.sudo(api.tx.tokens.create(user.address, amount)),
    sudo,
    {
      nonce
    }
  );
  const eventResult = getEventResultFromTxWait(result, [
    "tokens",
    "Issued",
    user.address
  ]);

  const tokenId = new BN(eventResult.data[0]["data"]);

  return tokenId;
};

export const getEventResultFromTxWait = (
  events: MangataGenericEvent[],
  searchTerm: string[] = []
): { state: ExtrinsicResult; data: string | number | any } => {
  const extrinsicResultMethods = [
    "ExtrinsicSuccess",
    "ExtrinsicFailed",
    "ExtrinsicUndefined"
  ];
  let extrinsicResult;
  if (searchTerm.length > 0) {
    extrinsicResult = events.find((e) => {
      return (
        e.method !== null &&
        searchTerm.every((filterTerm) =>
          (
            JSON.stringify(e.event.toHuman()) +
            JSON.stringify(e.event.toHuman().data)
          ).includes(filterTerm)
        )
      );
    });
  } else {
    extrinsicResult = events.find(
      (e) => e.method !== null && extrinsicResultMethods.includes(e.method)
    );
  }

  if (extrinsicResult) {
    switch (extrinsicResult.method) {
      case extrinsicResultMethods[1]:
        return {
          state: ExtrinsicResult.ExtrinsicFailed,
          data: "Extrinsic Failed"
        };

      case extrinsicResultMethods[2]:
        return {
          state: ExtrinsicResult.ExtrinsicUndefined,
          data: extrinsicResult.eventData
        };

      default:
        return {
          state: ExtrinsicResult.ExtrinsicSuccess,
          data: extrinsicResult.eventData
        };
    }
  }
  return { state: -1, data: "ERROR: NO TX FOUND" };
};

export const createMGXToken = async (
  sudoUser: KeyringPair,
  user: KeyringPair,
  amount: BN
): Promise<void> => {
  const api = await instance.getApi();
  const nonce = await instance.getNonce(sudoUser.address);
  await instance.waitForNewBlock(2);
  await signTx(
    api,
    api.tx.sudo.sudo(api.tx.tokens.mint("0", user.address, new BN(amount))),
    sudoUser,
    {
      nonce
    }
  );
};
