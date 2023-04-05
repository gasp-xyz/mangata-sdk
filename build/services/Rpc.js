import { BN, isHex, hexToBn } from "@polkadot/util";
export class Rpc {
    static async getChain(api) {
        const chain = await api.rpc.system.chain();
        return chain.toHuman();
    }
    static async getNodeName(api) {
        const name = await api.rpc.system.name();
        return name.toHuman();
    }
    static async getNodeVersion(api) {
        const version = await api.rpc.system.version();
        return version.toHuman();
    }
    static async calculateRewardsAmount(api, address, liquidityTokenId) {
        const rewards = await api.rpc.xyk.calculate_rewards_amount(address, liquidityTokenId);
        const price = isHex(rewards.price.toString())
            ? hexToBn(rewards.price.toString())
            : new BN(rewards.price);
        return price;
    }
    static async calculateBuyPrice(api, inputReserve, outputReserve, amount) {
        const result = await api.rpc.xyk.calculate_buy_price(inputReserve, outputReserve, amount);
        return new BN(result.price);
    }
    static async calculateSellPrice(api, inputReserve, outputReserve, amount) {
        const result = await api.rpc.xyk.calculate_sell_price(inputReserve, outputReserve, amount);
        return new BN(result.price);
    }
    // TODO: Need to figure out the return value from this method
    static async getBurnAmount(api, firstTokenId, secondTokenId, amount) {
        const result = await api.rpc.xyk.get_burn_amount(firstTokenId, secondTokenId, amount);
        const resultAsJson = JSON.parse(result.toString());
        return resultAsJson;
    }
    static async calculateSellPriceId(api, firstTokenId, secondTokenId, amount) {
        const result = await api.rpc.xyk.calculate_sell_price_id(firstTokenId, secondTokenId, amount);
        return new BN(result.price);
    }
    static async calculateBuyPriceId(api, firstTokenId, secondTokenId, amount) {
        const result = await api.rpc.xyk.calculate_buy_price_id(firstTokenId, secondTokenId, amount);
        return new BN(result.price);
    }
}
