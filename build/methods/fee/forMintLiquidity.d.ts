import { ApiPromise } from "@polkadot/api";
import { Object } from "ts-toolbelt";
import { MintLiquidity } from "../../types/xyk";
export declare type MintLiquidityFee = Object.Omit<MintLiquidity, "txOptions">;
export declare const forMintLiquidity: (instancePromise: Promise<ApiPromise>, args: MintLiquidityFee) => Promise<string>;
//# sourceMappingURL=forMintLiquidity.d.ts.map