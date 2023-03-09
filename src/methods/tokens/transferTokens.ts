import { ApiPromise } from "@polkadot/api";
import { Amount } from "../../types/common";
import { Transfer } from "../../types/tokens";
import { signTx } from "../../signTx";

export const transferTokens = async (
  instancePromise: Promise<ApiPromise>,
  args: Transfer & { amount: Amount }
) => {
  const api = await instancePromise;
  const { account, tokenId, address, txOptions, amount } = args;
  const tx = api.tx.tokens.transfer(address, tokenId, amount);
  return await signTx(api, tx, account, txOptions);
};
