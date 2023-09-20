import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";

export const getPoolsBalance = async (
  api: ApiPromise,
  liquidityAssets: {
    [identificator: string]: string;
  }
) => {
  const poolsBalanceResponse = await api.query.xyk.pools.entries();

  return poolsBalanceResponse.reduce((acc, [key, value]) => {
    const [identificator] = key.args;

    acc[liquidityAssets[identificator.toHex()]] = value.map(
      (balance) => new BN(balance)
    );
    return acc;
  }, {} as { [identificator: string]: BN[] });
};
