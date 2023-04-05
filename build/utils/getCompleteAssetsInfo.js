import { hexToString } from "@polkadot/util";
const ETHaddress = "0x0000000000000000000000000000000000000000";
const MGAaddress = "0xc7e3bda797d2ceb740308ec40142ae235e08144a";
export const getCompleteAssetsInfo = async (api) => {
    const assetsInfoResponse = await api.query.assetRegistry.metadata.entries();
    return assetsInfoResponse.reduce((obj, [key, value]) => {
        const tokenId = key.toHuman()[0].replace(/[, ]/g, "");
        const { name, decimals, symbol } = value.unwrap();
        const assetInfo = {
            id: tokenId,
            chainId: 0,
            decimals: Number(decimals.toString()),
            name: hexToString(name.toString()),
            symbol: hexToString(symbol.toString()),
            address: hexToString(symbol.toString()) === "MGA"
                ? MGAaddress
                : hexToString(symbol.toString()) === "ETH"
                    ? ETHaddress
                    : ""
        };
        obj[tokenId] = assetInfo;
        return obj;
    }, {});
};
