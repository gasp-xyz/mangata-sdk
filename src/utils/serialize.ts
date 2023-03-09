import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";

export const serializeTx = (
  api: ApiPromise,
  tx: SubmittableExtrinsic<"promise">
) => {
  if (!process.env.TX_VERBOSE) return "";

  const methodObject = JSON.parse(tx.method.toString());
  const args = JSON.stringify(methodObject.args);
  const callDecoded = api.registry.findMetaCall(tx.method.callIndex);
  if (callDecoded.method == "sudo" && callDecoded.method == "sudo") {
    const sudoCallIndex = (tx.method.args[0] as any).callIndex;
    const sudoCallArgs = JSON.stringify(methodObject.args.call.args);
    const sudoCallDecoded = api.registry.findMetaCall(sudoCallIndex);
    return ` (sudo:: ${sudoCallDecoded.section}:: ${sudoCallDecoded.method}(${sudoCallArgs})`;
  } else {
    return ` (${callDecoded.section}:: ${callDecoded.method}(${args}))`;
  }
};
