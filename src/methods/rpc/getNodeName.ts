import { ApiPromise } from "@polkadot/api";

/**
 * @since 2.0.0
 */
export const getNodeName = async (instancePromise: Promise<ApiPromise>) => {
  const api = await instancePromise;
  const name = await api.rpc.system.name();
  return name.toHuman();
};
