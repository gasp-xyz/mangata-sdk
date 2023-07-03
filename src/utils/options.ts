import { ApiOptions } from "@polkadot/api/types";
import { mTypes, mRpc } from "@mangata-finance/type-definitions";

export const options = ({
  types = {},
  rpc = {},
  ...otherOptions
}: ApiOptions = {}): ApiOptions => ({
  types: {
    ...mTypes,
    ...types
  },
  rpc: {
    ...mRpc,
    ...rpc
  },
  ...otherOptions
});
