import { ApiPromise } from "@polkadot/api";
import { Address, TokenId } from "../../types/common";
import { TokenBalance } from "../../types/query";
import { BN } from "@polkadot/util";

/**
 * @since 2.0.0
 */
export const getTokenBalance = async (
  instancePromise: Promise<ApiPromise>,
  tokenId: TokenId,
  address: Address
): Promise<TokenBalance> => {
  const api = await instancePromise;
  const { free, reserved, frozen } = await api.query.tokens.accounts(
    address,
    tokenId
  );

  return {
    free: new BN(free),
    reserved: new BN(reserved),
    frozen: new BN(frozen)
  };
};
