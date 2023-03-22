import { Account, Address, TokenId, TxOptions } from "./common";

export type Transfer = {
  account: Account;
  tokenId: TokenId;
  address: Address;
  txOptions?: Partial<TxOptions>;
};
