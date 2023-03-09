export const getNodeName = async (instancePromise) => {
    const api = await instancePromise;
    const name = await api.rpc.system.name();
    return name.toHuman();
};
