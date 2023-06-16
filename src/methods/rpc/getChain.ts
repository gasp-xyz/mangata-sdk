import { ApiPromise } from "@polkadot/api";

/**
 * @since 2.0.0
 */
export const getChain = async (instancePromise: Promise<ApiPromise>) => {
  const api = await instancePromise;
  const chain = await api.rpc.system.chain();
  return chain.toHuman();
};
