import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, afterAll, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { MangataHelpers } from "../index";
import {
  createMGXToken,
  getEventResultFromTxWait,
  ExtrinsicResult,
  createTokenForUser
} from "./utility";
import { MangataGenericEvent } from "../src/types/MangataGenericEvent";

let testUser: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: BN;
let secondTokenId: BN;

beforeEach(async () => {
  await instance.waitForNewBlock(2);

  const keyring = MangataHelpers.createKeyring("sr25519");
  testUser = MangataHelpers.createKeyPairFromName(keyring);
  sudoUser = MangataHelpers.createKeyPairFromName(keyring, SUDO_USER_NAME);

  await instance.waitForNewBlock(2);
  firstTokenId = await createTokenForUser(
    testUser,
    sudoUser,
    new BN("10000000000000000000000")
  );

  secondTokenId = await createTokenForUser(
    testUser,
    sudoUser,
    new BN("10000000000000000000000")
  );

  await createMGXToken(sudoUser, testUser, new BN("1000000000000000000000"));

  await instance.waitForNewBlock(2);
});

it("should create pool", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(50000),
    secondTokenId.toString(),
    new BN(50000),
    {
      extrinsicStatus: (result: MangataGenericEvent[]) => {
        const eventResult = getEventResultFromTxWait(result, [
          "xyk",
          "PoolCreated",
          testUser.address
        ]);
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
      }
    }
  );
});

it("should test the balance", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(50000),
    secondTokenId.toString(),
    new BN(60000)
  );

  const balance1 = await instance.getAmountOfTokenIdInPool(
    firstTokenId.toString(),
    secondTokenId.toString()
  );
  const balance2 = await instance.getAmountOfTokenIdInPool(
    secondTokenId.toString(),
    firstTokenId.toString()
  );

  expect(balance1[0].toNumber()).toEqual(50000);
  expect(balance1[1].toNumber()).toEqual(60000);
  expect(balance2[0].toNumber()).toEqual(0);
  expect(balance2[1].toNumber()).toEqual(0);
});

it("should buy asset", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(50000),
    secondTokenId.toString(),
    new BN(25000)
  );
  await instance.waitForNewBlock(2);
  await instance.buyAsset(
    testUser,
    firstTokenId.toString(),
    secondTokenId.toString(),
    new BN(1000),
    new BN(60000),
    {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result, [
          "xyk",
          "AssetsSwapped",
          testUser.address
        ]);
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
      }
    }
  );
});

it("should sell asset 4 times", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(100000),
    secondTokenId.toString(),
    new BN(100000)
  );
  const userNonce = [];
  userNonce.push(await instance.getNonce(testUser.address));
  const promises = [];
  const maxFutureNonce = userNonce[0].toNumber() + 3;
  for (let index = maxFutureNonce; index >= userNonce[0].toNumber(); index--) {
    promises.push(
      instance.sellAsset(
        testUser,
        firstTokenId.toString(),
        secondTokenId.toString(),
        new BN(1000 + index),
        new BN(0),
        {
          nonce: new BN(index)
        }
      )
    );
  }
  const promisesEvents = await Promise.all(promises);
  promisesEvents.forEach((events) => {
    const result = getEventResultFromTxWait(events);
    expect(result.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
  });
});

it("should sell asset", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(50000),
    secondTokenId.toString(),
    new BN(25000)
  );

  await instance.waitForNewBlock(2);

  await instance.sellAsset(
    testUser,
    firstTokenId.toString(),
    secondTokenId.toString(),
    new BN(10000),
    new BN(100),
    {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result, [
          "xyk",
          "AssetsSwapped",
          testUser.address
        ]);
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
      }
    }
  );
});

it("should mint liquidity", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(50000),
    secondTokenId.toString(),
    new BN(25000)
  );

  await instance.waitForNewBlock(2);

  await instance.mintLiquidity(
    testUser,
    firstTokenId.toString(),
    secondTokenId.toString(),
    new BN(10000),
    new BN(5001),
    {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result);
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
      }
    }
  );
});

it("should burn liquidity", async () => {
  const beforePools = await instance.getPools();

  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(50000),
    secondTokenId.toString(),
    new BN(25000)
  );

  await instance.waitForNewBlock(2);

  const liquidityTokenId = await instance.getLiquidityTokenId(
    firstTokenId.toString(),
    secondTokenId.toString()
  );

  await instance.waitForNewBlock(2);

  const investedPools = await instance.getInvestedPools(testUser.address);

  const investedPool = investedPools.find(
    (investedPool) =>
      investedPool.liquidityTokenId === liquidityTokenId.toString()
  );

  await instance.waitForNewBlock(2);

  const amountToBurn = investedPool.nonActivatedLPTokens.add(
    investedPool.activatedLPTokens
  );

  await instance.burnLiquidity(
    testUser,
    firstTokenId.toString(),
    secondTokenId.toString(),
    amountToBurn,
    {
      extrinsicStatus: (result) => {
        const eventResult = getEventResultFromTxWait(result);
        expect(eventResult.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
      }
    }
  );
  await instance.waitForNewBlock(2);

  const afterPools = await instance.getPools();

  expect(beforePools.length).toEqual(afterPools.length);
});

afterAll(async () => {
  await instance.disconnect();
});
