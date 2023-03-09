export const getNodeVersion = async (instancePromise) => {
    const api = await instancePromise;
    const version = await api.rpc.system.version();
    return version.toHuman();
};
