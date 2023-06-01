import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { BN } from "@polkadot/util";
import { FeeLockType } from "../../types/query";

/**
 * @since 2.0.0
 */
export const getFeeLockMetadata = async (
  instancePromise: Promise<ApiPromise>
): Promise<FeeLockType> => {
  const api = await instancePromise;
  const feeLockMetadata = (
    await api.query.feeLock.feeLockMetadata()
  ).toHuman() as {
    periodLength: string;
    feeLockAmount: string;
    swapValueThreshold: string;
    whitelistedTokens: number[];
  };

  return {
    periodLength: feeLockMetadata.periodLength.replace(/[,]/g, ""),
    feeLockAmount: feeLockMetadata.feeLockAmount.replace(/[,]/g, ""),
    swapValueThreshold: feeLockMetadata.swapValueThreshold.replace(/[,]/g, ""),
    whitelistedTokens: feeLockMetadata.whitelistedTokens
  };
};
