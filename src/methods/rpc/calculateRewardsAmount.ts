import { ApiPromise } from "@polkadot/api";
import { BN, isHex, hexToBn } from "@polkadot/util";
import { Rewards } from "../../types/xyk";

export const calculateRewardsAmount = async (
  instancePromise: Promise<ApiPromise>,
  args: Rewards
) => {
  const api = await instancePromise;
  const { address, liquidityTokenId } = args;
  const rewards = await (api.rpc as any).xyk.calculate_rewards_amount(
    address,
    liquidityTokenId
  );

  const price = isHex(rewards.price.toString())
    ? hexToBn(rewards.price.toString())
    : new BN(rewards.price);

  return price;
};
