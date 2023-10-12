import { ApiPromise } from "@polkadot/api";
import { BN, isHex, hexToBn } from "@polkadot/util";
import { Rewards } from "../../types/xyk";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const calculateRewardsAmount = async (
  instancePromise: Promise<ApiPromise>,
  args: Rewards
) => {
  logger.info("calculateRewardsAmount", {
    address: args.address,
    liquidityTokenId: args.liquidityTokenId
  });
  const api = await instancePromise;
  const { address, liquidityTokenId } = args;
  const rewards = await (api.rpc as any).xyk.calculate_rewards_amount(
    address,
    liquidityTokenId
  );

  return isHex(rewards.toString())
      ? hexToBn(rewards.toString())
      : new BN(rewards);
};
