import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Price } from "../../types/xyk";

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
