import { ApiPromise } from "@polkadot/api";
import { Liquidity } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type ClaimRewardsFee = Object.Omit<Liquidity, "txOptions">;
export declare const forClaimRewards: (instancePromise: Promise<ApiPromise>, args: ClaimRewardsFee) => Promise<string>;
//# sourceMappingURL=forClaimRewards.d.ts.map