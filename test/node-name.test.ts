import { it, expect, afterAll } from "vitest";
import { instance } from "./instanceCreation";

it("should match name when calling getNodeName method", async () => {
  const name = "Mangata";
  const nodeName = await instance.getNodeName();
  expect(nodeName).toMatch(new RegExp(`^${name}?`));
});

afterAll(async () => {
  await instance.disconnect();
});
