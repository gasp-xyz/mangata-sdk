import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { it, expect, beforeEach } from "vitest";
import { KeyringPair } from "@polkadot/keyring/types";

import { instance, SUDO_USER_NAME } from "./instance";
import {
  createMangataToken,
  createToken,
  createUser,
  getExtrinsicData
} from "./utility";
import { TransferTokens, Transfer, Batch } from "../src";

let testUser: KeyringPair;
let testUser1: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: string | undefined;
let secondTokenId: string | undefined;

beforeEach(async () => {
  const keyring = new Keyring({ type: "sr25519" });
  testUser = createUser(keyring);
  testUser1 = createUser(keyring);
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

it("should transfer tokens from testUser1 to testUser2", async () => {
  const argsTransferToken: TransferTokens = {
    account: testUser,
    tokenId: secondTokenId!,
    address: testUser1.address,
    amount: new BN("100"),
    txOptions: {
      extrinsicStatus: (data) => {
        const searchTerms = ["tokens", "Transfer", testUser.address];
        const extrinsicData = getExtrinsicData({ data, searchTerms });
        return expect(extrinsicData[0].method).toEqual("Transfer");
      }
    }
  };
  await instance.tokens.transferTokens(argsTransferToken);

  const argsTransfer: Transfer = {
    account: testUser,
    tokenId: firstTokenId!,
    address: testUser1.address,
    txOptions: {
      extrinsicStatus: (data) => {
        const searchTerms = ["tokens", "Transfer", testUser.address];
        const extrinsicData = getExtrinsicData({ data, searchTerms });
        return expect(extrinsicData[0].method).toEqual("Transfer");
      }
    }
  };

  await instance.tokens.transferAllTokens(argsTransfer);

  const issuance = await instance.query.getTotalIssuance(firstTokenId!);
  expect(issuance.toString()).toEqual("1000000000000000000000000");

  const tokenBalance = await instance.query.getTokenBalance(
    firstTokenId!,
    testUser1.address
  );
  expect(tokenBalance.free.toString()).toEqual("1000000000000000000000000");
});
