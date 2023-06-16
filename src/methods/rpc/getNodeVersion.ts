import { ApiPromise } from "@polkadot/api";

/**
 * @since 2.0.0
 */
export const getNodeVersion = async (instancePromise: Promise<ApiPromise>) => {
  const api = await instancePromise;
  const version = await api.rpc.system.version();
  return version.toHuman();
};
