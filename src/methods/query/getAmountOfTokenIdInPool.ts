import { ApiPromise } from "@polkadot/api";
import { BN, isHex, hexToBn } from "@polkadot/util";
import { TokenId } from "../../types/common";

export const getAmountOfTokenIdInPool = async (
  instancePromise: Promise<ApiPromise>,
  firstTokenId: TokenId,
  secondTokenId: TokenId
): Promise<BN[]> => {
  const api = await instancePromise;
  const balance = await api.query.xyk.pools([firstTokenId, secondTokenId]);
  const tokenValue1 = balance[0].toString();
  const tokenValue2 = balance[1].toString();
  const token1: BN = isHex(tokenValue1)
    ? hexToBn(tokenValue1)
    : new BN(tokenValue1);
  const token2: BN = isHex(tokenValue2)
    ? hexToBn(tokenValue2)
    : new BN(tokenValue2);
  return [token1, token2];
};
