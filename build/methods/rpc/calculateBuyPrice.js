import { BN } from "@polkadot/util";
export const calculateBuyPrice = async (instancePromise, args) => {
    const api = await instancePromise;
    const { inputReserve, outputReserve, amount } = args;
    const result = await api.rpc.xyk.calculate_buy_price(inputReserve, outputReserve, amount);
    return new BN(result.price);
};
