import { ApiPromise } from "@polkadot/api";

export const waitForNewBlock = async (
  instancePromise: Promise<ApiPromise>,
  blockCount?: number
): Promise<boolean> => {
  let count = 0;
  const api = await instancePromise;

  const numberOfBlocks = blockCount || 1;

  return new Promise(async (resolve) => {
    const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
      if (++count === numberOfBlocks) {
        unsubscribe();
        resolve(true);
      }
    });
  });
};
