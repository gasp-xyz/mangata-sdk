import { ApiPromise } from "@polkadot/api";
import { logger } from "../../utils/mangataLogger";

/**
 * @since 2.0.0
 */
export const waitForNewBlock = async (
  instancePromise: Promise<ApiPromise>,
  blockCount?: number
): Promise<boolean> => {
  let count = 0;
  const api = await instancePromise;

  const numberOfBlocks = blockCount || 1;

  logger.info("waitForNewBlock", {
    numberOfBlocks
  });

  return new Promise(async (resolve) => {
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
      if (++count === numberOfBlocks) {
        unsubscribe();
        resolve(true);
      }
    });
  });
};
