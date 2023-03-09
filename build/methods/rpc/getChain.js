export const getChain = async (instancePromise) => {
    const api = await instancePromise;
    const chain = await api.rpc.system.chain();
    return chain.toHuman();
};
