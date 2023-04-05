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
import { BurnLiquidity, CreatePool } from "../src";

let testUser: KeyringPair;
let sudoUser: KeyringPair;
let firstTokenId: string | undefined;
let secondTokenId: string | undefined;

beforeEach(async () => {
  const keyring = new Keyring({ type: "sr25519" });
  testUser = createUser(keyring);
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

it("should burn liquidity", async () => {
  const beforePools = await instance.query.getPools();

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
        return expect(extrinsicData?.method).toEqual("PoolCreated");
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
    (investedPool) =>
      investedPool.liquidityTokenId === liquidityTokenId.toString()
  );

  await instance.rpc.waitForNewBlock(2);

  const amountToBurn =
    investedPool &&
    investedPool.nonActivatedLPTokens.add(investedPool.activatedLPTokens);

  const argsBurnLiquidity: BurnLiquidity = {
    account: testUser,
    firstTokenId: firstTokenId!,
    secondTokenId: secondTokenId!,
    amount: amountToBurn!,
    txOptions: {
      extrinsicStatus: (data) => {
        console.log(JSON.stringify(data));
      }
    }
  };

  await instance.xyk.burnLiquidity(argsBurnLiquidity);

  await instance.rpc.waitForNewBlock(2);

  const afterPools = await instance.query.getPools();

  expect(beforePools.length).toEqual(afterPools.length);
});
