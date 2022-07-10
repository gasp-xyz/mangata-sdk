import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, afterAll, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { MangataHelpers } from "../index.js";
import { createMGXToken, createTokenForUser } from "./utility";

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

it("should test the balance in the pool", async () => {
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

afterAll(async () => {
  await instance.disconnect();
});
