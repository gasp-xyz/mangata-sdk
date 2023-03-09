import { ApiPromise } from "@polkadot/api";
import { Transfer } from "../../types/tokens";
import { signTx } from "../../signTx";

export const transferAllTokens = async (
  instancePromise: Promise<ApiPromise>,
  args: Transfer
) => {
  const api = await instancePromise;
  const { account, tokenId, address, txOptions } = args;
  const tx = api.tx.tokens.transferAll(address, tokenId, true);
  return await signTx(api, tx, account, txOptions);
};
