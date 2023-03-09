import { ApiPromise } from "@polkadot/api";
import { BuyAsset } from "../../types/xyk";
import { Object } from "ts-toolbelt";
export declare type BuyAssetFee = Object.Omit<BuyAsset, "txOptions">;
export declare const forBuyAsset: (instancePromise: Promise<ApiPromise>, args: BuyAssetFee) => Promise<string>;
//# sourceMappingURL=forBuyAsset.d.ts.map