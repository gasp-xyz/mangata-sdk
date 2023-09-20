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
import {
  Batch,
  CreatePool,
  MangataGenericEvent,
  MultiswapSellAsset
} from "../src";

let testUser: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: string | undefined;
let secondTokenId: string | undefined;

beforeEach(async () => {
  const keyring = new Keyring({ type: "sr25519" });
  testUser = createUser(keyring);
  sudoUser = createUser(keyring, SUDO_USER_NAME);

  const nonce = await instance.query.getNonce(sudoUser.address);

  const argsBatchAll: Batch = {
    account: sudoUser,
    calls: [
      await createToken(
        instance,
        testUser.address,
        new BN("1000000000000000000000000")
      ),
      await createToken(
        instance,
        testUser.address,
        new BN("1000000000000000000000000")
      ),
      await createMangataToken(
        instance,
        testUser.address,
        new BN("10000000000000000000000000")
      )
    ],
    txOptions: { nonce }
  };

  const data = await instance.batchAll(argsBatchAll);
  const searchTerms = ["tokens", "Issued", testUser.address];
  const extrinsicData = getExtrinsicData({ data, searchTerms });
  firstTokenId = extrinsicData[0].eventData[0].data.toString();
  secondTokenId = extrinsicData[1].eventData[0].data.toString();
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
        return expect(extrinsicData[0].method).toEqual("PoolCreated");
      }
    }
  };
  await instance.xyk.createPool(argsPool);
  const userNonce: BN[] = [];
  userNonce.push(await instance.query.getNonce(testUser.address));
  const promises: Promise<MangataGenericEvent[]>[] = [];
  const maxFutureNonce = userNonce[0].toNumber() + 3;
  for (let index = maxFutureNonce; index >= userNonce[0].toNumber(); index--) {
    const argsSellAsset: MultiswapSellAsset = {
      account: testUser,
      tokenIds: [firstTokenId!, secondTokenId!],
      amount: new BN(1000 + index),
      minAmountOut: new BN(0),
      txOptions: {
        nonce: new BN(index),
        extrinsicStatus: (data) => {
          const searchTerms = ["xyk", "AssetsSwapped", testUser.address];
          const extrinsicData = getExtrinsicData({ data, searchTerms });
          return expect(extrinsicData[0].method).toEqual("AssetsSwapped");
        }
      }
    };
    promises.push(instance.xyk.multiswapSellAsset(argsSellAsset));
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
