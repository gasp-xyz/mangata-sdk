import { BN, isHex, hexToBn } from "@polkadot/util";
export const calculateRewardsAmount = async (instancePromise, args) => {
    const api = await instancePromise;
    const { address, liquidityTokenId } = args;
    const rewards = await api.rpc.xyk.calculate_rewards_amount(address, liquidityTokenId);
    const price = isHex(rewards.price.toString())
        ? hexToBn(rewards.price.toString())
        : new BN(rewards.price);
    return price;
};
