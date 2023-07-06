import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";

export const getAccountBalances = async (api: ApiPromise, address: string) => {
  const ownedAssetsResponse = await api.query.tokens.accounts.entries(address);

  return ownedAssetsResponse.reduce(
    (acc, [key, value]) => {
      const [_, id] = key.args;

      acc[id.toString()] = {
        free: value.free,
        frozen: value.frozen,
        reserved: value.reserved
      };
      return acc;
    },
    {} as {
      [id: string]: {
        free: BN;
        frozen: BN;
        reserved: BN;
      };
    }
  );
};
