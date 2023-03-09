import { Withdraw } from "../../types/xTokens";
import { Object } from "ts-toolbelt";
import { ApiPromise } from "@polkadot/api";
export declare type WithdrawFee = Object.Omit<Withdraw, "txOptions">;
export declare const forWithdraw: (instancePromise: Promise<ApiPromise>, args: WithdrawFee) => Promise<string>;
//# sourceMappingURL=forWithdraw.d.ts.map