import { ApiPromise } from "@polkadot/api";

export const getBlockNumber = async (
  instancePromise: Promise<ApiPromise>
): Promise<string> => {
  const api = await instancePromise;
  const block = await api.rpc.chain.getBlock();
  return block.block.header.number.toString();
};
