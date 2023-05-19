import { ApiPromise } from "@polkadot/api";
import { Price } from "../../types/xyk";

/**
 * @since 2.0.0
 */
export const getBurnAmount = async (
  instancePromise: Promise<ApiPromise>,
  args: Price
) => {
  const api = await instancePromise;
  const { firstTokenId, secondTokenId, amount } = args;
  const result = await (api.rpc as any).xyk.get_burn_amount(
    firstTokenId,
    secondTokenId,
    amount
  );
  const resultAsJson = JSON.parse(result.toString());
  return resultAsJson;
};
