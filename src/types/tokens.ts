import { Merge, Except } from "type-fest";
import { Account, Address, TokenId, TxOptions, TokenAmount } from "./common";

export type Transfer = {
  account: Account;
  tokenId: TokenId;
  address: Address;
  txOptions?: Partial<TxOptions>;
};

export type TransferTokens = Merge<Transfer, { amount: TokenAmount }>;
export type TransferTokenFee = Merge<
  Except<Transfer, "txOptions">,
  { amount: TokenAmount }
>;
export type TransferAllFee = Except<Transfer, "txOptions">;
