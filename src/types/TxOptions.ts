import { Signer } from "@polkadot/api/types";
import type { ISubmittableResult } from "@polkadot/types/types";
import { BN } from "@polkadot/util";

import { MangataGenericEvent } from "./MangataGenericEvent";

export type TxOptions = Partial<{
  nonce: BN;
  signer: Signer;
  statusCallback: (result: ISubmittableResult) => void;
  extrinsicStatus: (events: MangataGenericEvent[]) => void;
}>;
