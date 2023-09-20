import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instance";
import type { Batch, CreatePool, MultiswapBuyAsset } from "../src";
import {
  createMangataToken,
  createToken,
  createUser,
  getExtrinsicData
} from "./utility";

let testUser: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: string;
let secondTokenId: string;

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

it("should buy asset", async () => {
  const argsPool: CreatePool = {
    account: testUser,
    firstTokenId: firstTokenId!,
    secondTokenId: secondTokenId!,
    firstTokenAmount: new BN(50000),
    secondTokenAmount: new BN(25000),
    txOptions: {
      extrinsicStatus: (data) => {
        const searchTerms = ["xyk", "PoolCreated", testUser.address];
        const extrinsicData = getExtrinsicData({ data, searchTerms });
        return expect(extrinsicData[0].method).toEqual("PoolCreated");
      }
    }
  };
  await instance.xyk.createPool(argsPool);

  await instance.rpc.waitForNewBlock(2);

  const argsBuyAsset: MultiswapBuyAsset = {
    account: testUser,
    tokenIds: [firstTokenId!, secondTokenId!],
    amount: new BN(1000),
    maxAmountIn: new BN(60000)
  };

  const tx1 = await instance.submitableExtrinsic.multiswapBuyAsset(
    argsBuyAsset
  );
  const tx2 = await instance.submitableExtrinsic.multiswapBuyAsset(
    argsBuyAsset
  );

  const argsBatch: Batch = {
    account: testUser,
    calls: [tx1, tx2],
    txOptions: {
      extrinsicStatus: (data) => {
        return expect(data[data.length - 1].method).toEqual("ExtrinsicSuccess");
      }
    }
  };
  await instance.batch(argsBatch);
});
