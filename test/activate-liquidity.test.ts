import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instance";
import { signTx, type Batch, type CreatePool, type Liquidity } from "../src";
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

it("should create pool", async () => {
  const args: CreatePool = {
    account: testUser,
    firstTokenId: firstTokenId!,
    secondTokenId: secondTokenId!,
    firstTokenAmount: new BN("10000000000000000000000"),
    secondTokenAmount: new BN("10000000000000000000000"),
    txOptions: {
      extrinsicStatus: (data) => {
        const searchTerms = ["xyk", "PoolCreated", testUser.address];
        const extrinsicData = getExtrinsicData({ data, searchTerms });
        return expect(extrinsicData[0].method).toEqual("PoolCreated");
      }
    }
  };
  await instance.xyk.createPool(args);

  await instance.rpc.waitForNewBlock(2);

  const liqtoken = await instance.query.getLiquidityTokenId(
    firstTokenId!,
    secondTokenId!
  );
  const api = await instance.api();
  await signTx(
    api,
    api.tx.sudo.sudo(api.tx.proofOfStake.updatePoolPromotion(liqtoken, 100)),
    sudoUser
  );

  await instance.rpc.waitForNewBlock(2);

  const argsLiq: Liquidity = {
    account: testUser,
    liquidityTokenId: liqtoken.toString(),
    amount: new BN(100)
  };
  await instance.xyk.activateLiquidity(argsLiq, "AvailableBalance");
});
