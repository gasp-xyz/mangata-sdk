import { ApiPromise } from "@polkadot/api";
import { hexToBn, isHex, BN, BN_ZERO } from "@polkadot/util";
import { TokenId } from "../../types/common";
import { TMainTokens, TTokenInfo } from "../../types/query";
import { getCompleteAssetsInfo } from "../../utils/getCompleteAssetsInfo";
import { pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/lib/Array";
import * as S from "fp-ts/lib/string";

export const getAssetsInfo = async (
  instancePromise: Promise<ApiPromise>
): Promise<TMainTokens> => {
  const api = await instancePromise;
  const completeAssetsInfo = await getCompleteAssetsInfo(api);
  // we need to filter out ETH and Dummy liquidity token
  // then we need to display symbol for liquidity token
  return pipe(
    Object.values(completeAssetsInfo),
    A.filter((assetsInfo) => !["1", "3", "6"].includes(assetsInfo.id)),
    A.reduce({} as { [id: TokenId]: TTokenInfo }, (obj, item) => {
      const asset = {
        ...item,
        name: pipe(
          item.name,
          S.replace(/0x\w+/, ""),
          S.replace(/[A-Z]/g, "$&"),
          S.trim
        ),
        symbol: pipe(item.symbol, S.includes("TKN"))
          ? pipe(
              item.symbol.split("-"),
              A.reduce([] as string[], (acc, curr) => {
                const currentValue = pipe(curr, S.replace("TKN", ""));
                const tokenId = pipe(currentValue, S.startsWith("0x"))
                  ? hexToBn(currentValue).toString()
                  : currentValue;
                const symbol = completeAssetsInfo[tokenId].symbol;
                acc.push(symbol);
                return acc;
              })
            ).join("-")
          : item.symbol
      };
      obj[asset.id] = asset;
      return obj;
    })
  );
};
