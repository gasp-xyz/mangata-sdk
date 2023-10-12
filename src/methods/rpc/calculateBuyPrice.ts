import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Reserve } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const calculateBuyPrice = async (
  instancePromise: Promise<ApiPromise>,
  args: Reserve
) => {
  logger.info("calculateBuyPrice", {
    inputReserve: args.inputReserve.toString(),
    outputReserve: args.outputReserve.toString(),
    amount: args.amount.toString()
  });
  const api = await instancePromise;
  const { inputReserve, outputReserve, amount } = args;
  const price = await (api.rpc as any).xyk.calculate_buy_price(
    inputReserve,
    outputReserve,
    amount
  );
  return new BN(price);
};
