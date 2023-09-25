import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { TokenAmount, TokenId } from "../../types/common";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const calculateBuyPriceId = async (
  instancePromise: Promise<ApiPromise>,
  soldTokenId: TokenId,
  boughtTokenId: TokenId,
  amount: TokenAmount
) => {
  logger.info("calculateBuyPriceId", {
    soldTokenId,
    boughtTokenId,
    amount: amount.toString()
  });
  const api = await instancePromise;
  const price = await (api.rpc as any).xyk.calculate_buy_price_id(
    soldTokenId,
    boughtTokenId,
    amount
  );
  return new BN(price);
};
