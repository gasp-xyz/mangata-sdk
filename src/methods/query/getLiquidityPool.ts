import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { BN } from "@polkadot/util";

export const getLiquidityPool = async (
  instancePromise: Promise<ApiPromise>,
  liquidityTokenId: TokenId
): Promise<BN[]> => {
  const api = await instancePromise;
  const liquidityPool = await api.query.xyk.liquidityPools(liquidityTokenId);
  if (!liquidityPool.isSome) return [new BN(-1), new BN(-1)];
  return liquidityPool.unwrap().map((num) => new BN(num));
};
