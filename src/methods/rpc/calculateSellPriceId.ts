import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Price } from "../../types/xyk";

/**
 * @since 2.0.0
 */
export const calculateSellPriceId = async (
  instancePromise: Promise<ApiPromise>,
  args: Price
) => {
  const api = await instancePromise;
  const { firstTokenId, secondTokenId, amount } = args;
  const result = await (api.rpc as any).xyk.calculate_sell_price_id(
    firstTokenId,
    secondTokenId,
    amount
  );
  return new BN(result.price);
};
