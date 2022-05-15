/* eslint-disable no-console */
import { BN } from "@polkadot/util";
import { KeyringPair } from "@polkadot/keyring/types";

import { instance, SUDO_USER_NAME } from "./instanceCreation";
import { MangataHelpers } from "../src";
import {
  addAccountCurrencies,
  addMGAToken,
  getEventResultFromTxWait,
  ExtrinsicResult
} from "./utility";

let testUser: KeyringPair;
let testUser1: KeyringPair;
let sudoUser: KeyringPair;
let firstCurrency: string;
let secondCurrency: string;

beforeEach(async () => {
  await instance.waitForNewBlock(2);
  const keyring = MangataHelpers.createKeyring("sr25519");
  testUser =
    MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring);
  testUser1 =
    MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(keyring);
  sudoUser = MangataHelpers.createKeyPairFromNameAndStoreAccountToKeyring(
    keyring,
    SUDO_USER_NAME
  );

  await instance.waitForNewBlock(2);
  const currencies = await addAccountCurrencies(instance, testUser, sudoUser, [
    new BN(500000),
    new BN(500000).add(new BN(1))
  ]);
  firstCurrency = currencies[0].toString();
  secondCurrency = currencies[1].toString();
  await addMGAToken(instance, sudoUser, testUser);
  await instance.waitForNewBlock(2);
});

describe("Testing additional methods", () => {
  it("should transfer tokens from testUser1 to testUser2", async () => {
    console.log("Transferring tokens from testUser1 to testUser2");
    await instance.transferToken(
      testUser,
      secondCurrency,
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
      firstCurrency,
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
    const issuance = await instance.getTotalIssuance(firstCurrency);
    expect(issuance.toNumber()).toEqual(500000);
    const tokenBalance = await instance.getTokenBalance(
      firstCurrency,
      testUser1.address
    );
    expect(tokenBalance.free.toNumber()).toEqual(500000);
    const lock = await instance.getLock(testUser.address, firstCurrency);
    expect(lock).toEqual([]);
  });
});

it("should get next token id", async () => {
  await instance.createPool(
    testUser,
    firstCurrency,
    new BN(50000),
    secondCurrency,
    new BN(25000)
  );
  await instance.waitForNewBlock(2);
  const liquidityAssetId = await instance.getLiquidityTokenId(
    firstCurrency,
    secondCurrency
  );
  expect(liquidityAssetId.toNumber()).toBeGreaterThanOrEqual(0);
});

it("should get next token id", async () => {
  const tokenId = await instance.getNextTokenId();
  expect(tokenId.toNumber()).toBeGreaterThanOrEqual(0);
});

it("should get treasury", async () => {
  const accountData = await instance.getTreasury(firstCurrency);
  expect(accountData.free.toBn().toNumber()).toBeGreaterThanOrEqual(0);
});

it("should get treasury burn", async () => {
  const accountData = await instance.getTreasuryBurn(firstCurrency);
  expect(accountData.free.toBn().toNumber()).toBeGreaterThanOrEqual(0);
});

afterAll(async () => {
  await instance.disconnect();
});
