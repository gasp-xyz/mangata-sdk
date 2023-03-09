import { ApiPromise } from "@polkadot/api";
import { Liquidity } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type DeactivateLiquidityFee = Object.Omit<Liquidity, "txOptions">;
export declare const forDeactivateLiquidity: (instancePromise: Promise<ApiPromise>, args: DeactivateLiquidityFee) => Promise<string>;
//# sourceMappingURL=forDeactivateLiquidity.d.ts.map