import { ApiPromise } from "@polkadot/api";
import { Transfer } from "../../types/tokens";
import { Object } from "ts-toolbelt";
export declare type TransferAllFee = Object.Omit<Transfer, "txOptions">;
export declare const forTransferAllToken: (instancePromise: Promise<ApiPromise>, args: TransferAllFee) => Promise<string>;
//# sourceMappingURL=forTransferAllToken.d.ts.map