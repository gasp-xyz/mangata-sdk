import "@mangata-finance/types";
import { PriceImpact } from "./types/utility";
import { getPriceImpact } from "./utils/getPriceImpact";
import { createMangataInstance } from "./mangataInstance";

const Mangata = {
  instance: createMangataInstance,
  getPriceImpact: (args: PriceImpact) => getPriceImpact(args)
};

export { Mangata };
