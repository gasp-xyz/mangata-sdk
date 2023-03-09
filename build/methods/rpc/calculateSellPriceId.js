import { BN } from "@polkadot/util";
export const calculateSellPriceId = async (instancePromise, args) => {
    const api = await instancePromise;
    const { firstTokenId, secondTokenId, amount } = args;
    const result = await api.rpc.xyk.calculate_sell_price_id(firstTokenId, secondTokenId, amount);
    return new BN(result.price);
};
