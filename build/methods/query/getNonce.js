export const getNonce = async (instancePromise, address) => {
    const api = await instancePromise;
    const nonce = await api.rpc.system.accountNextIndex(address);
    return nonce.toBn();
};
