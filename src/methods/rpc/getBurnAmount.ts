import { ApiPromise } from "@polkadot/api";
import { BurnAmount, Price } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getBurnAmount = async (
  instancePromise: Promise<ApiPromise>,
  args: Price
) => {
  logger.info("getBurnAmount", {
    firstTokenId: args.firstTokenId,
    secondTokenId: args.secondTokenId,
    amount: args.amount.toString()
  });
  const api = await instancePromise;
  const { firstTokenId, secondTokenId, amount } = args;
  const result = await (api.rpc as any).xyk.get_burn_amount(
    firstTokenId,
    secondTokenId,
    amount
  );
  const resultAsJson = JSON.parse(result.toString());
  return resultAsJson as BurnAmount;
};
