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
import { TransferTokens, Transfer } from "../src";

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
        return expect(extrinsicData?.method).toEqual("Transfer");
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
        return expect(extrinsicData?.method).toEqual("Transfer");
      }
    }
  };

  await instance.tokens.transferAllTokens(argsTransfer);

  const issuance = await instance.query.getTotalIssuance(firstTokenId!);
  expect(issuance.toString()).toEqual("1000000000000000000000000");

  const tokenBalance = await instance.query.getTokenBalance(
    testUser1.address,
    firstTokenId!
  );
  expect(tokenBalance.free.toString()).toEqual("1000000000000000000000000");
});
