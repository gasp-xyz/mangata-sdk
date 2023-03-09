import { ApiPromise } from "@polkadot/api";
import { Amount } from "../../types/common";
import { Transfer } from "../../types/tokens";
export declare const transferTokens: (instancePromise: Promise<ApiPromise>, args: Transfer & {
    amount: Amount;
}) => Promise<import("../../types/common").MangataGenericEvent[]>;
//# sourceMappingURL=transferTokens.d.ts.map