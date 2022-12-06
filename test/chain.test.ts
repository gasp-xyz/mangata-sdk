import { it, expect, afterAll } from "vitest";
import { instance } from "./instanceCreation";

it("should retrive chain name when calling getChain method", async () => {
  const chainName = "Mangata Rococo Local";
  const chain = await instance.getChain();
  expect(chain).toMatch(new RegExp(`^${chainName}?`));
});

afterAll(async () => {
  await instance.disconnect();
});
