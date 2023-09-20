import { BN } from "@polkadot/util";
import { Keyring } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { it, expect, beforeEach } from "vitest";

import { instance, SUDO_USER_NAME } from "./instance";
import { ExtrinsicCommon, signTx, type Batch, type CreatePool, type Liquidity } from "../src";
import {
  createMangataToken,
  createToken,
  createUser,
  getExtrinsicData
} from "./utility";

let testUser1: KeyringPair;
let testUser2: KeyringPair;
let sudoUser: KeyringPair;
let tokens: string[] | undefined;

beforeEach(async () => {
  const api = await instance.api();
  const keyring = new Keyring({ type: "sr25519" });
  testUser1 = createUser(keyring);
  testUser2 = createUser(keyring);
  sudoUser = createUser(keyring, SUDO_USER_NAME);

  let nonce = await instance.query.getNonce(sudoUser.address);

  /// create tokens for liquidity minting
  const calls = await Promise.all([...Array(21).keys()].map((_) => createToken(
        instance,
        testUser1.address,
        new BN("1000000000000000000000000")
      )));
  calls.push(
    await createMangataToken(
      instance,
      testUser1.address,
      new BN("10000000000000000000000000")
    )
  )
  calls.push(
    await createMangataToken(
      instance,
      testUser2.address,
      new BN("10000000000000000000000000")
    )
  )
  calls.push(api.tx.sudo.sudo(api.tx.issuance.finalizeTge()));
  calls.push(api.tx.sudo.sudo(api.tx.issuance.initIssuanceConfig()));

  const argsBatchAll: Batch = {
    account: sudoUser,
    calls,
    txOptions: { nonce }
  };

  const data = await instance.batchAll(argsBatchAll);
  const searchTerms = ["tokens", "Issued", testUser1.address];
  const extrinsicData = getExtrinsicData({ data, searchTerms });
  tokens = extrinsicData.map(data => {
    return data.eventData[0].data.toString();
  })

  /// protmote tokens
  await signTx(
    api,
    api.tx.sudo.sudo(api.tx.utility.batch(
      await Promise.all(tokens!.map(
        (tokenId) => api.tx.proofOfStake.updatePoolPromotion(tokenId, 100)
    )))),
    sudoUser
  );

  /// transfer tokens to testUser2
  nonce = await instance.query.getNonce(sudoUser.address);
  await instance.batchAll({
    account: testUser1,
    calls: tokens.map((token) => api.tx.tokens.transfer(testUser2.address, token, new BN("100000000000000000000000"))
  ),
  });
});

it("should claim rewards from multiple pools", async () => {
  const api = await instance.api();
  const activatedTokens = tokens!.slice(0,10);

  await Promise.all(
    activatedTokens.map((tokenId) => {
      const argsLiq: Liquidity = {
        account: testUser1,
        liquidityTokenId: tokenId.toString(),
        amount: new BN(100)
      };
      return instance.xyk.activateLiquidity(argsLiq, "AvailableBalance");
  }))

  const wait_for_rewards = new Promise<void>(async (resolve, _) => {
    const unsub_new_heads = await api.derive.chain.subscribeNewHeads(async (header) => {
      const rewards = await Promise.all(activatedTokens.map((token)=> instance.rpc.calculateRewardsAmount(
        {
        address: testUser1.address,
        liquidityTokenId: token
        })));

      if (rewards.every(elem => elem.gtn(0))){
        unsub_new_heads();
        resolve();
      }else{
        console.log(`#${header.number} no rewards available yet`);
      }
    })
  });
  await wait_for_rewards;

  const results = await instance.xyk.claimRewardsAll({account: testUser1});
  const searchTerms = ["proofOfStake", "RewardsClaimed", testUser1.address];
  const filteredEvents = getExtrinsicData({ data: results, searchTerms });
  filteredEvents.forEach((ev)=> expect(ev.method).eq("RewardsClaimed"))

});

it("should throw error when claiming rewards for too many tokens", async () => {

  const api = await instance.api();


  const promotionCalls = await Promise.all([...tokens!].map((tokenId) =>
    api.tx.proofOfStake.updatePoolPromotion(tokenId, 100)
  ))
  await signTx(
    api,
    api.tx.sudo.sudo(api.tx.utility.batch(promotionCalls)),
    sudoUser
  );

  await Promise.all(
    tokens!.map((tokenId) => {
      const argsLiq: Liquidity = {
        account: testUser2,
        liquidityTokenId: tokenId.toString(),
        amount: new BN(100)
      };
      return instance.xyk.activateLiquidity(argsLiq, "AvailableBalance");
  }))

  const wait_for_rewards = new Promise<void>(async (resolve, _) => {
    const unsub_new_heads = await api.derive.chain.subscribeNewHeads(async (header) => {
      const rewards = await Promise.all(tokens!.map((token)=> instance.rpc.calculateRewardsAmount(
        {
        address: testUser2.address,
        liquidityTokenId: token
        })));

      if (rewards.every(elem => elem.gtn(0))){
        unsub_new_heads();
        resolve();
      }else{
        console.log(`#${header.number} no rewards available yet`);
      }
    })
  });
  await wait_for_rewards;

  expect(instance.xyk.claimRewardsAll({account: testUser2})).rejects.toThrow("consider claiming rewards separately")

});
