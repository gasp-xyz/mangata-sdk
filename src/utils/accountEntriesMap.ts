import { ApiPromise } from "@polkadot/api";
import { BN, isHex, hexToBn } from "@polkadot/util";

export const accountEntriesMap = async (api: ApiPromise, address: string) => {
  const ownedAssetsResponse = await api.query.tokens.accounts.entries(address);

  return ownedAssetsResponse.reduce(
    (acc, [key, value]) => {
      const free = JSON.parse(JSON.stringify(value)).free.toString();
      const frozen = JSON.parse(JSON.stringify(value)).frozen.toString();
      const reserved = JSON.parse(JSON.stringify(value)).reserved.toString();
      const freeBN = isHex(free) ? hexToBn(free) : new BN(free);
      const frozenBN = isHex(frozen) ? hexToBn(frozen) : new BN(frozen);
      const reservedBN = isHex(reserved) ? hexToBn(reserved) : new BN(reserved);
      const id = (key.toHuman() as string[])[1].replace(/[, ]/g, "");
      const balance = {
        free: freeBN,
        frozen: frozenBN,
        reserved: reservedBN
      };
      acc[id] = balance;
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
