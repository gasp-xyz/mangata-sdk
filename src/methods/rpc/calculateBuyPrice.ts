import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Reserve } from "../../types/xyk";

export const calculateBuyPrice = async (
  instancePromise: Promise<ApiPromise>,
  args: Reserve
) => {
  const api = await instancePromise;
  const { inputReserve, outputReserve, amount } = args;
  const result = await (api.rpc as any).xyk.calculate_buy_price(
    inputReserve,
    outputReserve,
    amount
  );
  return new BN(result.price);
};
