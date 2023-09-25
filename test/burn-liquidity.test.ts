import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instance";
import {
  createMangataToken,
  createToken,
  createUser,
  getExtrinsicData
} from "./utility";
import { Batch, BurnLiquidity, CreatePool } from "../src";

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

it("should burn liquidity", async () => {

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
        return expect(extrinsicData[0].method).toEqual("PoolCreated");
      }
    }
  };
  await instance.xyk.createPool(argsPool);

  const liquidityTokenId = await instance.query.getLiquidityTokenId(
    firstTokenId!,
    secondTokenId!
  );

  const investedPools = await instance.query.getInvestedPools(testUser.address);

  const investedPool = investedPools.find(
    (investedPool) => investedPool.liquidityTokenId === liquidityTokenId
  );

  await instance.rpc.waitForNewBlock(2);

  const amountToBurn =
    investedPool &&
    investedPool.nonActivatedLPTokens.add(investedPool.activatedLPTokens);

  const argsBurnLiquidity: BurnLiquidity = {
    account: testUser,
    firstTokenId: firstTokenId!,
    secondTokenId: secondTokenId!,
    amount: amountToBurn!
  };

  await instance.xyk.burnLiquidity(argsBurnLiquidity);

  await instance.rpc.waitForNewBlock(2);

  const currentPool = await instance.query.getPool(liquidityTokenId)
  expect(currentPool.firstTokenAmount.toString()).toEqual("0")
  expect(currentPool.secondTokenAmount.toString()).toEqual("0")
});
