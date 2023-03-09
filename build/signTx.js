import { serializeTx } from "./utils/serialize";
import { getTxNonce } from "./utils/getTxNonce";
import { dbInstance } from "./utils/inMemoryDatabase";
import { truncatedString } from "./utils/truncatedString";
import { getError } from "./utils/getTxError";
export const signTx = async (api, tx, account, txOptions) => {
    return new Promise(async (resolve, reject) => {
        const extractedAccount = typeof account === "string" ? account : account.address;
        const nonce = await getTxNonce(api, extractedAccount, txOptions);
        try {
            await tx.signAsync(account, { nonce, signer: txOptions?.signer });
        }
        catch (error) {
            reject(error);
        }
        console.info(`submitting Tx[${tx.hash.toString()}]who: ${extractedAccount} nonce: ${nonce.toString()} `);
        try {
            const unsub = await tx.send(async (result) => {
                console.info(`Tx[${tx.hash.toString()}]who: ${extractedAccount} nonce: ${nonce.toString()} => ${result.status.type}(${result.status.value.toString()})${serializeTx(api, tx)}`);
                txOptions?.statusCallback?.(result);
                if (result.status.isInBlock) {
                    const inclusionBlockHash = result.status.asInBlock.toString();
                    const inclusionBlockHeader = await api.rpc.chain.getHeader(inclusionBlockHash);
                    const inclusionBlockNr = inclusionBlockHeader.number.toBn();
                    const executionBlockStartNr = inclusionBlockNr.addn(1);
                    const executionBlockStopNr = inclusionBlockNr.addn(10);
                    const executionBlockNr = executionBlockStartNr;
                    const unsubscribeNewHeads = await api.rpc.chain.subscribeNewHeads(async (lastHeader) => {
                        const lastBlockNumber = lastHeader.number.toBn();
                        if (executionBlockNr.gt(executionBlockStopNr)) {
                            unsubscribeNewHeads();
                            reject(`Tx([${tx.hash.toString()}])
                        was not executed in blocks : ${executionBlockStartNr.toString()}..${executionBlockStopNr.toString()}`);
                            const nonce = await api.rpc.system.accountNextIndex(extractedAccount);
                            const currentNonce = nonce.toBn();
                            dbInstance.setNonce(extractedAccount, currentNonce);
                            unsub();
                            return;
                        }
                        if (lastBlockNumber.gte(executionBlockNr)) {
                            const blockHash = await api.rpc.chain.getBlockHash(executionBlockNr);
                            const blockHeader = await api.rpc.chain.getHeader(blockHash);
                            const extinsics = (await api.rpc.chain.getBlock(blockHeader.hash)).block.extrinsics;
                            const events = await api.query.system.events.at(blockHeader.hash);
                            //increment
                            executionBlockNr.iaddn(1);
                            const index = extinsics.findIndex((extrinsic) => {
                                return extrinsic.hash.toString() === tx.hash.toString();
                            });
                            if (index < 0) {
                                console.info(`Tx([${tx.hash.toString()}]) not found in block ${executionBlockNr} $([${truncatedString(blockHash.toString())}])`);
                                return;
                            }
                            else {
                                unsubscribeNewHeads();
                                console.info(`Tx[${tx.hash.toString()}]who:${extractedAccount} nonce:${nonce.toString()} => Executed(${blockHash.toString()})`);
                            }
                            const eventsTriggeredByTx = events
                                .filter((currentBlockEvent) => {
                                return (currentBlockEvent.phase.isApplyExtrinsic &&
                                    currentBlockEvent.phase.asApplyExtrinsic.toNumber() ===
                                        index);
                            })
                                .map((eventRecord) => {
                                const { event, phase } = eventRecord;
                                const types = event.typeDef;
                                const eventData = event.data.map((d, i) => {
                                    return {
                                        lookupName: types[i].lookupName,
                                        data: d
                                    };
                                });
                                return {
                                    event,
                                    phase,
                                    section: event.section,
                                    method: event.method,
                                    metaDocumentation: event.meta.docs.toString(),
                                    eventData,
                                    error: getError(api, event.method, eventData)
                                };
                            });
                            txOptions?.extrinsicStatus?.(eventsTriggeredByTx);
                            resolve(eventsTriggeredByTx);
                            unsub();
                        }
                    });
                }
                else if (result.isError) {
                    console.info("Transaction Error Result", JSON.stringify(result, null, 2));
                    reject(`Tx([${tx.hash.toString()}]) Transaction error`);
                    const nonce = await api.rpc.system.accountNextIndex(extractedAccount);
                    const currentNonce = nonce.toBn();
                    dbInstance.setNonce(extractedAccount, currentNonce);
                }
            });
        }
        catch (error) {
            const nonce = await api.rpc.system.accountNextIndex(extractedAccount);
            const currentNonce = nonce.toBn();
            dbInstance.setNonce(extractedAccount, currentNonce);
            reject({
                data: error.message ||
                    error.description ||
                    error.data?.toString() ||
                    error.toString()
            });
        }
    });
};
