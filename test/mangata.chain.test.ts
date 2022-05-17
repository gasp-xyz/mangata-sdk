import { it, expect, afterAll } from "vitest";
import { instance } from "./instanceCreation";

it("should retrive chain name when calling getChain method", async () => {
  const chainName = "Mangata Local";
  const chain = await instance.getChain();
  expect(chain).toMatch(new RegExp(`^${chainName}?`));
});

it("should match version 0.4.0 node version when calling getNodeVersion method", async () => {
  const version = "0.1.0-unknown-x86_64-linux-gnu";
  const nodeVersion = await instance.getNodeVersion();
  expect(nodeVersion).toMatch(new RegExp(`^${version}?`));
});

it("should match name when calling getNodeName method", async () => {
  const name = "Mangata";
  const nodeName = await instance.getNodeName();
  expect(nodeName).toMatch(new RegExp(`^${name}?`));
});

afterAll(async () => {
  await instance.disconnect();
});
