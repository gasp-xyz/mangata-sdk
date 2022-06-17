import { Mangata } from "../index";
import { it, expect } from "vitest";

it("should get different instances for different urls", async () => {
  const developMangata = Mangata.getInstance(["develop"]);
  const productionMangata = Mangata.getInstance(["production"]);
  expect(developMangata.getUrls()).not.toBe(productionMangata.getUrls());
});
