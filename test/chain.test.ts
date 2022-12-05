import { BN } from "bn.js";
import { it, expect, afterAll } from "vitest";
import { instance } from "./instanceCreation";

it("should retrive chain name when calling getChain method", async () => {
  // const chainName = "Mangata Rococo Local";
  // const chain = await instance.getChain();
  // expect(chain).toMatch(new RegExp(`^${chainName}?`));
  const r = await instance.calculateFutureRewardsAmountForMinting(
    "12",
    new BN("200"),
    new BN("216000")
  );

  console.log(r.toString());
});

afterAll(async () => {
  await instance.disconnect();
});
