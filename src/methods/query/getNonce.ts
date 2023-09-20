import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";
import { Address } from "../../types/common";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const getNonce = async (
  instancePromise: Promise<ApiPromise>,
  address: Address
): Promise<BN> => {
  logger.info("getNonce", { address });
  const api = await instancePromise;
  const nonce = await api.rpc.system.accountNextIndex(address);
  return nonce.toBn();
};
