import { hexToBn } from "@polkadot/util";
import { getCompleteAssetsInfo } from "../../utils/getCompleteAssetsInfo";
export const getAssetsInfo = async (instancePromise) => {
    const api = await instancePromise;
    const completeAssetsInfo = await getCompleteAssetsInfo(api);
    // we need to filter out ETH and Dummy liquidity token
    // then we need to display symbol for liquidity token
    return Object.values(completeAssetsInfo)
        .filter((assetsInfo) => !["1", "3", "6"].includes(assetsInfo.id))
        .reduce((obj, item) => {
        const asset = {
            ...item,
            name: item.name.replace(/0x\w+/, "").replace(/[A-Z]/g, " $&").trim(),
            symbol: item.symbol.includes("TKN")
                ? item.symbol
                    .split("-")
                    .reduce((acc, curr) => {
                    const currentValue = curr.replace("TKN", "");
                    const tokenId = currentValue.startsWith("0x")
                        ? hexToBn(currentValue).toString()
                        : currentValue;
                    const symbol = completeAssetsInfo[tokenId].symbol;
                    acc.push(symbol);
                    return acc;
                }, [])
                    .join("-")
                : item.symbol
        };
        obj[asset.id] = asset;
        return obj;
    }, {});
};
