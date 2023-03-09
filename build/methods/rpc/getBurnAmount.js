export const getBurnAmount = async (instancePromise, args) => {
    const api = await instancePromise;
    const { firstTokenId, secondTokenId, amount } = args;
    const result = await api.rpc.xyk.get_burn_amount(firstTokenId, secondTokenId, amount);
    const resultAsJson = JSON.parse(result.toString());
    return resultAsJson;
};
