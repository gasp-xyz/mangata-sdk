import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ISubmittableResult } from "@polkadot/types/types";
import { AnyTuple } from "@polkadot/types-codec/types";
import { GenericExtrinsic } from "@polkadot/types";
import { ApiPromise } from "@polkadot/api";
import { BN } from "@polkadot/util";

import {
  Account,
  MangataEventData,
  MangataGenericEvent,
  TxOptions
} from "../types/common";
import { serializeTx } from "./serialize";
import { getTxNonce } from "./getTxNonce";
import { dbInstance } from "./inMemoryDatabase";
import { truncatedString } from "./truncatedString";
import { getTxError } from "./getTxError";
import { logger } from "./mangataLogger";

export const signTx = async (
  api: ApiPromise,
  tx: SubmittableExtrinsic<"promise">,
  account: Account,
  txOptions?: Partial<TxOptions>
): Promise<MangataGenericEvent[]> => {
  return new Promise<MangataGenericEvent[]>(async (resolve, reject) => {
    const extractedAccount =
      typeof account === "string" ? account : account.address;

    let subscribed = false;
    const nonce = await getTxNonce(api, extractedAccount, txOptions);
    try {
      await tx.signAsync(account, { nonce, signer: txOptions?.signer });
    } catch (error: any) {
      reject(error);
    }
    logger.trace(
      `submitting Tx[${tx.hash.toString()}]who: ${extractedAccount} nonce: ${nonce.toString()} `
    );
    try {
      const unsub = await tx.send(async (result: ISubmittableResult) => {
        logger.trace(
          `Tx[${tx.hash.toString()}]who: ${extractedAccount} nonce: ${nonce.toString()} => ${
            result.status.type
          }(${result.status.value.toString()})${serializeTx(api, tx)}`
        );

        txOptions?.statusCallback?.(result);
        if (
          (result.status.isInBlock || result.status.isFinalized) &&
          !subscribed
        ) {
          subscribed = true;
          let inclusionBlockHash;
          if (result.status.isInBlock) {
            inclusionBlockHash = result.status.asInBlock.toString();
          } else if (result.status.isFinalized) {
            inclusionBlockHash = result.status.asFinalized.toString();
          }
          const inclusionBlockHeader = await api.rpc.chain.getHeader(
            inclusionBlockHash
          );
          const inclusionBlockNr = inclusionBlockHeader.number.toBn();
          const executionBlockStartNr = inclusionBlockNr.addn(0);
          const executionBlockStopNr = inclusionBlockNr.addn(10);
          const executionBlockNr = executionBlockStartNr;

          const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(
            async (lastHeader) => {
              const lastBlockNumber = lastHeader.number.toBn();

              if (executionBlockNr.gt(executionBlockStopNr)) {
                unsubscribeNewHeads();
                reject(
                  `Tx([${tx.hash.toString()}])
                        was not executed in blocks : ${executionBlockStartNr.toString()}..${executionBlockStopNr.toString()}`
                );
                const nonce = await api.rpc.system.accountNextIndex(
                  extractedAccount
                );

                const currentNonce: BN = nonce.toBn();
                dbInstance.setNonce(extractedAccount, currentNonce);
                unsub();
                return;
              }

              if (lastBlockNumber.gte(executionBlockNr)) {
                const blockHash = await api.rpc.chain.getBlockHash(
                  executionBlockNr
                );
                const blockHeader = await api.rpc.chain.getHeader(blockHash);
                const extinsics: GenericExtrinsic<AnyTuple>[] = (
                  await api.rpc.chain.getBlock(blockHeader.hash)
                ).block.extrinsics;
                const apiAt = await api.at(blockHeader.hash);
                const events = await apiAt.query.system.events();

                executionBlockNr.iaddn(1);

                const index = extinsics.findIndex((extrinsic) => {
                  return extrinsic.hash.toString() === tx.hash.toString();
                });

                if (index < 0) {
                  logger.trace(
                    `Tx([${tx.hash.toString()}]) not found in block ${executionBlockNr} $([${truncatedString(
                      blockHash.toString()
                    )}])`
                  );
                  return;
                } else {
                  unsubscribeNewHeads();
                  logger.trace(
                    `Tx[${tx.hash.toString()}]who:${extractedAccount} nonce:${nonce.toString()} => Executed(${blockHash.toString()})`
                  );
                }

                const eventsTriggeredByTx: MangataGenericEvent[] = events
                  .filter((currentBlockEvent) => {
                    return (
                      currentBlockEvent.phase.isApplyExtrinsic &&
                      currentBlockEvent.phase.asApplyExtrinsic.toNumber() ===
                        index
                    );
                  })
                  .map((eventRecord) => {
                    const { event, phase } = eventRecord;
                    const types = event.typeDef;
                    const eventData: MangataEventData[] = event.data.map(
                      (d: any, i: any) => {
                        return {
                          lookupName: types[i].lookupName!,
                          data: d
                        };
                      }
                    );

                    return {
                      event,
                      phase,
                      section: event.section,
                      method: event.method,
                      metaDocumentation: event.meta.docs.toString(),
                      eventData,
                      error: getTxError(api, event.method, eventData)
                    } as MangataGenericEvent;
                  });

                txOptions?.extrinsicStatus?.(eventsTriggeredByTx);
                resolve(eventsTriggeredByTx);
                unsub();
              }
            }
          );
        } else if (result.isError) {
          logger.trace(
            "Transaction Error Result",
            JSON.stringify(result, null, 2)
          );
          reject(`Tx([${tx.hash.toString()}]) Transaction error`);
          const nonce = await api.rpc.system.accountNextIndex(extractedAccount);
          const currentNonce: BN = nonce.toBn();
          dbInstance.setNonce(extractedAccount, currentNonce);
        }
      });
    } catch (error: any) {
      const nonce = await api.rpc.system.accountNextIndex(extractedAccount);
      const currentNonce: BN = nonce.toBn();
      dbInstance.setNonce(extractedAccount, currentNonce);
      reject({
        data:
          error.message ||
          error.description ||
          error.data?.toString() ||
          error.toString()
      });
    }
  });
};
