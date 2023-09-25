
import { ApiPromise } from "@polkadot/api";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getLiquidityTokensForTrading = async (
    instancePromise: Promise<ApiPromise>
) => {
    logger.info("getLiquidityTokensForTrading");
    const api = await instancePromise;
    const lpTokens = await (api.rpc as any).xyk.get_liq_tokens_for_trading()
    const lpTokensForTrading: string[] = lpTokens.map((item: any) => item.toString());
    return lpTokensForTrading
};