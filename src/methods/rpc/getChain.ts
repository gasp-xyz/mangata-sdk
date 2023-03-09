import { ApiPromise } from "@polkadot/api";

export const getChain = async (instancePromise: Promise<ApiPromise>) => {
  const api = await instancePromise;
  const chain = await api.rpc.system.chain();
  return chain.toHuman();
};
