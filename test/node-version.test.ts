import { it, expect, afterAll } from "vitest";
import { instance } from "./instanceCreation";

it("should match node version when calling getNodeVersion method", async () => {
  const version = "0.1.0";
  const nodeVersion = await instance.getNodeVersion();
  expect(nodeVersion).toMatch(new RegExp(`^${version}?`));
});

afterAll(async () => {
  await instance.disconnect();
});
