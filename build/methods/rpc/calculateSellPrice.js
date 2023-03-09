import { BN } from "@polkadot/util";
export const calculateSellPrice = async (instancePromise, args) => {
    const api = await instancePromise;
    const { inputReserve, outputReserve, amount } = args;
    const result = await api.rpc.xyk.calculate_sell_price(inputReserve, outputReserve, amount);
    return new BN(result.price);
};
