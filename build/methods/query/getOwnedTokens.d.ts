import { ApiPromise } from "@polkadot/api";
import { TokenId } from "../../types/common";
import { TToken } from "../../types/query";
export declare const getOwnedTokens: (instancePromise: Promise<ApiPromise>, address: string) => Promise<{
    [id: string]: TToken;
} | null>;
//# sourceMappingURL=getOwnedTokens.d.ts.map