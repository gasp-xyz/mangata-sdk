import { BN } from "@polkadot/util";
import { it, expect, afterAll, beforeEach } from "vitest";
import { KeyringPair } from "@polkadot/keyring/types";

import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { MangataHelpers } from "../index.mjs";
import {
  createMGXToken,
  getEventResultFromTxWait,
  ExtrinsicResult,
  createTokenForUser
} from "./utility";

let testUser: KeyringPair;
let testUser1: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: BN;
let secondTokenId: BN;

beforeEach(async () => {
  await instance.waitForNewBlock(2);

  const keyring = MangataHelpers.createKeyring("sr25519");
  testUser = MangataHelpers.createKeyPairFromName(keyring);
  testUser1 = MangataHelpers.createKeyPairFromName(keyring);
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

it("should transfer tokens from testUser1 to testUser2", async () => {
  await instance.transferToken(
    testUser,
    secondTokenId.toString(),
    testUser1.address,
    new BN(100),
    {
      extrinsicStatus: (result) => {
        const eventTransfer = getEventResultFromTxWait(result, [
          "tokens",
          "Transfer",
          testUser.address
        ]);
        expect(eventTransfer.state).toEqual(ExtrinsicResult.ExtrinsicSuccess);
      }
    }
  );

  await instance.transferTokenAll(
    testUser,
    firstTokenId.toString(),
    testUser1.address,
    {
      extrinsicStatus: (resultTransferAll) => {
        const eventTransferAll = getEventResultFromTxWait(resultTransferAll, [
          "tokens",
          "Transfer",
          testUser.address
        ]);
        expect(eventTransferAll.state).toEqual(
          ExtrinsicResult.ExtrinsicSuccess
        );
      }
    }
  );

  const issuance = await instance.getTotalIssuance(firstTokenId.toString());
  expect(issuance.toString()).toEqual("10000000000000000000000");

  const tokenBalance = await instance.getTokenBalance(
    firstTokenId.toString(),
    testUser1.address
  );
  expect(tokenBalance.free.toString()).toEqual("10000000000000000000000");
});

afterAll(async () => {
  await instance.disconnect();
});
