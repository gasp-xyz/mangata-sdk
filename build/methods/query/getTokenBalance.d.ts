import { ApiPromise } from "@polkadot/api";
import { Address, TokenId } from "../../types/common";
import { TokenBalance } from "../../types/query";
export declare const getTokenBalance: (instancePromise: Promise<ApiPromise>, address: Address, tokenId: TokenId) => Promise<TokenBalance>;
//# sourceMappingURL=getTokenBalance.d.ts.map