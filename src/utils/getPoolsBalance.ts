import { ApiPromise } from "@polkadot/api";
import { hexToBn, isHex, BN } from "@polkadot/util";

type TLiquidityTokens = {
  [identificator: string]: string;
};

export const getPoolsBalance = async (
  api: ApiPromise,
  liquidityAssets: TLiquidityTokens
) => {
  const poolsBalanceResponse = await api.query.xyk.pools.entries();

  return poolsBalanceResponse.reduce((acc, [key, value]) => {
    const identificator = key.args.map((k) => k.toHuman())[0] as string;
    const balancesResponse = JSON.parse(JSON.stringify(value)) as string[];
    const balances = balancesResponse.map((balance) =>
      isHex(balance) ? hexToBn(balance) : new BN(balance)
    );

    acc[liquidityAssets[identificator]] = balances;
    return acc;
  }, {} as { [identificator: string]: BN[] });
};
