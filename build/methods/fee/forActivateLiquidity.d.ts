import { ApiPromise } from "@polkadot/api";
import { Liquidity } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type ActivateLiquidityFee = Object.Omit<Liquidity, "txOptions">;
export declare const forActivateLiquidity: (instancePromise: Promise<ApiPromise>, args: ActivateLiquidityFee) => Promise<string>;
//# sourceMappingURL=forActivateLiquidity.d.ts.map