import { ApiPromise } from "@polkadot/api";

/**
 * @since 2.0.0
 */
export const getBlockNumber = async (
  instancePromise: Promise<ApiPromise>
): Promise<string> => {
  const api = await instancePromise;
  const block = await api.rpc.chain.getBlock();
  return block.block.header.number.toString();
};
