import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instance";
import {
  createMangataToken,
  createToken,
  createUser,
  getExtrinsicData
} from "./utility";
import { CreatePool, MangataGenericEvent, SellAsset } from "../src";

let testUser: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: string | undefined;
let secondTokenId: string | undefined;

beforeEach(async () => {
  const keyring = new Keyring({ type: "sr25519" });
  testUser = createUser(keyring);
  sudoUser = createUser(keyring, SUDO_USER_NAME);

  firstTokenId = await createToken(instance, {
    user: testUser,
    sudo: sudoUser,
    amount: new BN("1000000000000000000000000")
  });

  secondTokenId = await createToken(instance, {
    user: testUser,
    sudo: sudoUser,
    amount: new BN("1000000000000000000000000")
  });

  await createMangataToken(instance, {
    sudo: sudoUser,
    user: testUser,
    amount: new BN("10000000000000000000000000")
  });
});

it("should sell asset 4 times", async () => {
  const argsPool: CreatePool = {
    account: testUser,
    firstTokenId: firstTokenId!,
    secondTokenId: secondTokenId!,
    firstTokenAmount: new BN(100000),
    secondTokenAmount: new BN(100000),
    txOptions: {
      extrinsicStatus: (data) => {
        const searchTerms = ["xyk", "PoolCreated", testUser.address];
        const extrinsicData = getExtrinsicData({ data, searchTerms });
        return expect(extrinsicData?.method).toEqual("PoolCreated");
      }
    }
  };
  await instance.xyk.createPool(argsPool);
  const userNonce: BN[] = [];
  userNonce.push(await instance.query.getNonce(testUser.address));
  const promises: Promise<MangataGenericEvent[]>[] = [];
  const maxFutureNonce = userNonce[0].toNumber() + 3;
  for (let index = maxFutureNonce; index >= userNonce[0].toNumber(); index--) {
    const argsSellAsset: SellAsset = {
      account: testUser,
      soldTokenId: firstTokenId!,
      boughtTokenId: secondTokenId!,
      amount: new BN(1000 + index),
      minAmountOut: new BN(0),
      txOptions: {
        nonce: new BN(index),
        extrinsicStatus: (data) => {
          const searchTerms = ["xyk", "AssetsSwapped", testUser.address];
          const extrinsicData = getExtrinsicData({ data, searchTerms });
          return expect(extrinsicData?.method).toEqual("AssetsSwapped");
        }
      }
    };
    promises.push(instance.xyk.sellAsset(argsSellAsset));
  }
  const promisesEvents = await Promise.all(promises);
  promisesEvents.forEach((events) => {
    const extrinsicResultMethods = [
      "ExtrinsicSuccess",
      "ExtrinsicFailed",
      "ExtrinsicUndefined"
    ];
    const extrinsicResult = events.find(
      (e) => e.method !== null && extrinsicResultMethods.includes(e.method)
    );

    return expect(extrinsicResult?.method).toEqual("ExtrinsicSuccess");
  });
});
