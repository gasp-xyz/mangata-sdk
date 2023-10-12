import { ApiPromise } from "@polkadot/api";
import {TradeAbleTokens} from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getTradeableTokens = async (
    instancePromise: Promise<ApiPromise>
) => {
    logger.info("getTradeableTokens");
    const api = await instancePromise;
    const tokens = await (api.rpc as any).xyk.get_tradeable_tokens()
    const tradeableTokens: TradeAbleTokens[] = tokens.map((item: any) => ({
        tokenId: item.tokenId.toString(),
        decimals: parseInt(item.decimals, 10),
        name: item.name.toUtf8(),
        symbol: item.symbol.toUtf8(),
    }));
    return tradeableTokens
};