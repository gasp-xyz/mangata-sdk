import { ApiPromise } from "@polkadot/api";
import { TTokenInfo } from "../types/AssetInfo";
export declare const getCompleteAssetsInfo: (api: ApiPromise) => Promise<{
    [id: string]: TTokenInfo;
}>;
//# sourceMappingURL=getCompleteAssetsInfo.d.ts.map