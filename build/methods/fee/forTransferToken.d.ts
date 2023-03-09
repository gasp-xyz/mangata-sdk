import { ApiPromise } from "@polkadot/api";
import { Amount } from "../../types/common";
import { Transfer } from "../../types/tokens";
import { Object } from "ts-toolbelt";
export declare type TransferTokenFee = Object.Merge<Object.Omit<Transfer, "txOptions">, {
    amount: Amount;
}>;
export declare const forTransferToken: (instancePromise: Promise<ApiPromise>, args: TransferTokenFee) => Promise<string>;
//# sourceMappingURL=forTransferToken.d.ts.map