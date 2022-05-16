import { Mangata } from "../index";

it("should get different instances for different uri", async () => {
  const developMangata = Mangata.getInstance("develop");
  const productionMangata = Mangata.getInstance("production");
  expect(developMangata.getUri()).not.toBe(productionMangata.getUri());
});
