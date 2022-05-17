import { Mangata } from "../index";
import { it, expect } from "vitest";

it("should get different instances for different uri", async () => {
  const developMangata = Mangata.getInstance("develop");
  const productionMangata = Mangata.getInstance("production");
  expect(developMangata.getUri()).not.toBe(productionMangata.getUri());
});
