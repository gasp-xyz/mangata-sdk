import { ApiPromise } from "@polkadot/api";

export const getNodeName = async (instancePromise: Promise<ApiPromise>) => {
  const api = await instancePromise;
  const name = await api.rpc.system.name();
  return name.toHuman();
};
