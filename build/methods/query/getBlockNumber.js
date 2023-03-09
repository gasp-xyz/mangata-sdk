export const getBlockNumber = async (instancePromise) => {
    const api = await instancePromise;
    const block = await api.rpc.chain.getBlock();
    return block.block.header.number.toString();
};
