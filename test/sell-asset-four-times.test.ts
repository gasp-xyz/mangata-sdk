import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, afterAll, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { MangataHelpers } from "../src/MangataHelpers";
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

it("should sell asset 4 times", async () => {
  await instance.createPool(
    testUser,
    firstTokenId.toString(),
    new BN(100000),
    secondTokenId.toString(),
    new BN(100000)
  );
  const userNonce: BN[] = [];
  userNonce.push(await instance.getNonce(testUser.address));
  const promises: any = [];
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

afterAll(async () => {
  await instance.disconnect();
});
