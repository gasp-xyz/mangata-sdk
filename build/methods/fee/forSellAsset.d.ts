import { ApiPromise } from "@polkadot/api";
import { SellAsset } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type SellAssetFee = Object.Omit<SellAsset, "txOptions">;
export declare const forSellAsset: (instancePromise: Promise<ApiPromise>, args: SellAssetFee) => Promise<string>;
//# sourceMappingURL=forSellAsset.d.ts.map