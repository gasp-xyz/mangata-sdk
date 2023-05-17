import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instance";
import type { CreatePool, MultiswapSellAsset, SellAsset } from "../src";
import {
  createMangataToken,
  createToken,
  createUser,
  getExtrinsicData
} from "./utility";

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

it.skip("should sell asset", async () => {
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
        return expect(extrinsicData?.method).toEqual("PoolCreated");
      }
    }
  };
  await instance.xyk.createPool(argsPool);

  await instance.rpc.waitForNewBlock(2);

  const argsMultiswapSellAsset: MultiswapSellAsset = {
    account: testUser,
    tokenIds: [firstTokenId!, secondTokenId!],
    amount: new BN(10000),
    minAmountOut: new BN(100),
    txOptions: {
      extrinsicStatus: (data) => {
        console.log(data);
      }
    }
  };
  await instance.xyk.multiswapSellAsset(argsMultiswapSellAsset);
});
