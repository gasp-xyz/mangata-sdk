import { ApiPromise } from "@polkadot/api";
import { BurnLiquidity } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type BurnLiquidityFee = Object.Omit<BurnLiquidity, "txOptions">;
export declare const forBurnLiquidity: (instancePromise: Promise<ApiPromise>, args: BurnLiquidityFee) => Promise<string>;
//# sourceMappingURL=forBurnLiquidity.d.ts.map