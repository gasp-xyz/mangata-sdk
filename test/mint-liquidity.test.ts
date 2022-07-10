import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, afterAll, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { MangataHelpers } from "../index.js";
import {
  createMGXToken,
  getEventResultFromTxWait,
  ExtrinsicResult,
  createTokenForUser
} from "./utility";

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

afterAll(async () => {
  await instance.disconnect();
});
