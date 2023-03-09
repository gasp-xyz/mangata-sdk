import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Price } from "../../types/xyk";

export const calculateBuyPriceId = async (
  instancePromise: Promise<ApiPromise>,
  args: Price
) => {
  const api = await instancePromise;
  const { firstTokenId, secondTokenId, amount } = args;
  const result = await (api.rpc as any).xyk.calculate_buy_price_id(
    firstTokenId,
    secondTokenId,
    amount
  );
  return new BN(result.price);
};
