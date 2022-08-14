/* eslint-disable no-console */
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { BN, isHex, hexToU8a } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";

import { instance } from "../utils/MemoryDatabase";
import { getTxNonce } from "../utils/getTxNonce";
import { recreateExtrinsicsOrder } from "../utils/recreateExtrinsicsOrder";
import { Query } from "../services/Query";
import { TxOptions, XcmTxOptions } from "../types/TxOptions";
import { MangataGenericEvent } from "../types/MangataGenericEvent";
import { MangataEventData } from "../types/MangataEventData";
import { truncatedString } from "../utils/truncatedString";

function serializeTx(api: ApiPromise, tx: SubmittableExtrinsic<"promise">) {
  if (!process.env.TX_VERBOSE) return "";

  const methodObject = JSON.parse(tx.method.toString());
  const args = JSON.stringify(methodObject.args);
  const callDecoded = api.registry.findMetaCall(tx.method.callIndex);
  if (callDecoded.method == "sudo" && callDecoded.method == "sudo") {
    const sudoCallIndex = (tx.method.args[0] as any).callIndex;
    const sudoCallArgs = JSON.stringify(methodObject.args.call.args);
    const sudoCallDecoded = api.registry.findMetaCall(sudoCallIndex);
    return ` (sudo::${sudoCallDecoded.section}::${sudoCallDecoded.method}(${sudoCallArgs})`;
  } else {
    return ` (${callDecoded.section}::${callDecoded.method}(${args}))`;
  }
}

export const signTx = async (
  api: ApiPromise,
  tx: SubmittableExtrinsic<"promise">,
  account: string | KeyringPair,
  txOptions?: TxOptions
): Promise<MangataGenericEvent[]> => {
  return new Promise<MangataGenericEvent[]>(async (resolve, reject) => {
    let output: MangataGenericEvent[] = [];
    const extractedAccount =
      typeof account === "string" ? account : account.address;

    const nonce = await getTxNonce(api, extractedAccount, txOptions);
    let retries = 0;
    try {
      const unsub = await tx.signAndSend(
        account,
        {
          nonce,
          signer: txOptions?.signer
        },
        async (result) => {
          console.info(
            `Tx[${truncatedString(tx.hash.toString())}] => ${
              result.status.type
            }(${result.status.value.toString()})${serializeTx(api, tx)}`
          );

          txOptions?.statusCallback?.(result);
          if (result.status.isFinalized) {
            const inclusionBlockHash = result.status.asFinalized.toString();
            const inclusionBlockHeader = await api.rpc.chain.getHeader(
              inclusionBlockHash
            );
            const inclusionBlockNr = inclusionBlockHeader.number.toBn();
            const executionBlockNr = inclusionBlockNr.addn(1);

            const unsubscribeNewHeads =
              await api.rpc.chain.subscribeFinalizedHeads(
                async (lastHeader) => {
                  const lastBlockNumber = lastHeader.number.toBn();

                  if (lastBlockNumber.gt(inclusionBlockNr)) {
                    const executionBlockHash = await api.rpc.chain.getBlockHash(
                      executionBlockNr
                    );
                    const executionBlockHeader = await api.rpc.chain.getHeader(
                      executionBlockHash
                    );
                    unsubscribeNewHeads();
                    const currentBlock = await api.rpc.chain.getBlock(
                      executionBlockHeader.hash
                    );
                    const currentBlockExtrinsics =
                      currentBlock.block.extrinsics;
                    const currentBlockEvents = await api.query.system.events.at(
                      executionBlockHeader.hash
                    );
                    const headerJsonResponse = JSON.parse(
                      executionBlockHeader.toString()
                    );

                    const buffer: Buffer = Buffer.from(
                      headerJsonResponse["seed"]["seed"].substring(2),
                      "hex"
                    );
                    const countOfExtrinsicsFromThisBlock =
                      headerJsonResponse["count"];
                    const currentBlockInherents = currentBlockExtrinsics
                      .slice(0, countOfExtrinsicsFromThisBlock)
                      .filter((tx) => {
                        return !tx.isSigned;
                      });
                    const previousBlockExtrinsics =
                      currentBlockExtrinsics.slice(
                        countOfExtrinsicsFromThisBlock,
                        currentBlockExtrinsics.length
                      );
                    const bothBlocksExtrinsics = currentBlockInherents.concat(
                      previousBlockExtrinsics
                    );

                    const unshuffledInherents = bothBlocksExtrinsics.filter(
                      (tx) => {
                        return !tx.isSigned;
                      }
                    );

                    const shuffledExtrinscs = recreateExtrinsicsOrder(
                      bothBlocksExtrinsics
                        .filter((tx) => {
                          return tx.isSigned;
                        })
                        .map((tx) => {
                          const who = tx.isSigned
                            ? tx.signer.toString()
                            : "0000";
                          return [who, tx];
                        }),
                      Uint8Array.from(buffer)
                    );

                    const executionOrder =
                      unshuffledInherents.concat(shuffledExtrinscs);

                    const index = executionOrder.findIndex((extrinsic) => {
                      return extrinsic.hash.toString() === tx.hash.toString();
                    });

                    if (index < 0) {
                      bothBlocksExtrinsics.forEach((e) => {
                        console.info(
                          `Tx ([${truncatedString(
                            tx.hash.toString()
                          )}]) origin ${e.hash.toString()}`
                        );
                      });
                      executionOrder.forEach((e) => {
                        console.info(
                          `Tx ([${truncatedString(
                            tx.hash.toString()
                          )}]) shuffled ${e.hash.toString()}`
                        );
                      });
                      reject(
                        `Tx ([${tx.hash.toString()}])
                      could not be find in the block
                      $([${truncatedString(inclusionBlockHash)}])`
                      );
                    }
                    const reqEvents: MangataGenericEvent[] = currentBlockEvents
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
                          error: getError(api, event.method, eventData)
                        } as MangataGenericEvent;
                      });

                    output = output.concat(reqEvents);
                    txOptions?.extrinsicStatus?.(output);
                    resolve(output);
                    unsub();
                  } else if (retries++ < 10) {
                    console.info(
                      `Retry [${retries}] Tx: [${truncatedString(
                        tx.hash.toString()
                      )}] current: #${lastHeader.number} [${truncatedString(
                        lastHeader.hash.toString()
                      )}] finalized in: #${inclusionBlockNr} [${truncatedString(
                        inclusionBlockHash
                      )}] `
                    );
                  } else {
                    //Lets retry this for 10 times until we reject the promise.
                    unsubscribeNewHeads();
                    reject(
                      `Transaction was not finalized: Tx ([${truncatedString(
                        tx.hash.toString()
                      )}]): parent hash: ([${truncatedString(
                        lastHeader.parentHash.toString()
                      )}]): Status finalized: ([${truncatedString(
                        inclusionBlockHash
                      )}])`
                    );
                    const currentNonce: BN = await Query.getNonce(
                      api,
                      extractedAccount
                    );
                    instance.setNonce(extractedAccount, currentNonce);
                    unsub();
                  }
                }
              );
          } else if (result.isError) {
            console.info(
              "Transaction Error Result",
              JSON.stringify(result, null, 2)
            );
            reject(
              `Tx ([${truncatedString(tx.hash.toString())}]) Transaction error`
            );
            const currentNonce: BN = await Query.getNonce(
              api,
              extractedAccount
            );
            instance.setNonce(extractedAccount, currentNonce);
          }
        }
      );
    } catch (error: any) {
      const currentNonce: BN = await Query.getNonce(api, extractedAccount);
      instance.setNonce(extractedAccount, currentNonce);
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

type TErrorData = {
  Module?: {
    index?: string;
    error?: string;
  };
};

const getError = (
  api: ApiPromise,
  method: string,
  eventData: MangataEventData[]
): {
  documentation: string[];
  name: string;
} | null => {
  const failedEvent = method === "ExtrinsicFailed";

  if (failedEvent) {
    const error = eventData.find((item) =>
      item.lookupName.includes("DispatchError")
    );
    const errorData = error?.data?.toHuman?.() as TErrorData | undefined;
    const errorIdx = errorData?.Module?.error;
    const moduleIdx = errorData?.Module?.index;

    if (errorIdx && moduleIdx) {
      try {
        const decode = api.registry.findMetaError({
          error: isHex(errorIdx) ? hexToU8a(errorIdx) : new BN(errorIdx),
          index: new BN(moduleIdx)
        });
        return {
          documentation: decode.docs,
          name: decode.name
        };
      } catch (error) {
        return {
          documentation: ["Unknown error"],
          name: "UnknownError"
        };
      }
    } else {
      return {
        documentation: ["Unknown error"],
        name: "UnknownError"
      };
    }
  }

  return null;
};

export class Tx {
  static async sendKusamaTokenFromRelayToParachain(
    kusamaEndpointUrl: string,
    ksmAccount: string | KeyringPair,
    destinationMangataAddress: string,
    amount: BN,
    parachainId: number,
    txOptions?: XcmTxOptions
  ) {
    const provider = new WsProvider(kusamaEndpointUrl);
    const kusamaApi = await new ApiPromise({ provider }).isReady;

    const destination = {
      V1: {
        interior: {
          X1: {
            ParaChain: parachainId
          }
        },
        parents: 0
      }
    };

    const beneficiary = {
      V1: {
        interior: {
          X1: {
            AccountId32: {
              id: kusamaApi
                .createType("AccountId32", destinationMangataAddress)
                .toHex(),
              network: "Any"
            }
          }
        },
        parents: 0
      }
    };

    const assets = {
      V1: [
        {
          fun: {
            Fungible: amount
          },
          id: {
            Concrete: {
              interior: "Here",
              parents: 0
            }
          }
        }
      ]
    };

    await kusamaApi.tx.xcmPallet
      .reserveTransferAssets(destination, beneficiary, assets, 0)
      .signAndSend(ksmAccount, {
        signer: txOptions?.signer,
        nonce: txOptions?.nonce
      });
  }
  static async sendKusamaTokenFromParachainToRelay(
    api: ApiPromise,
    mangataAccount: string | KeyringPair,
    destinationKusamaAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const destination = {
      V1: {
        parents: 1,
        interior: {
          X1: {
            AccountId32: {
              network: "Any",
              id: api
                .createType("AccountId32", destinationKusamaAddress)
                .toHex()
            }
          }
        }
      }
    };

    await api.tx.xTokens
      .transfer("4", amount, destination, new BN("6000000000"))
      .signAndSend(mangataAccount, {
        signer: txOptions?.signer,
        nonce: txOptions?.nonce
      });
  }

  static async sendTurTokenFromTuringToMangata(
    api: ApiPromise,
    turingUrl: string,
    account: string | KeyringPair,
    mangataAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const provider = new WsProvider(turingUrl);
    const turingApi = await new ApiPromise({ provider }).isReady;
    const correctAddress = encodeAddress(mangataAddress, 42);

    const asset = {
      V1: {
        id: {
          Concrete: {
            parents: 1,
            interior: {
              X1: {
                Parachain: 2114
              }
            }
          }
        },
        fun: {
          Fungible: amount
        }
      }
    };

    const destination = {
      V1: {
        parents: 1,
        interior: {
          X2: [
            {
              Parachain: 2110
            },
            {
              AccountId32: {
                network: "Any",
                id: api.createType("AccountId32", correctAddress).toHex()
              }
            }
          ]
        }
      }
    };

    await turingApi.tx.xTokens
      .transferMultiasset(asset, destination, new BN("4000000000"))
      .signAndSend(account, {
        signer: txOptions?.signer,
        nonce: txOptions?.nonce
      });
  }

  static async sendTurTokenFromMangataToTuring(
    api: ApiPromise,
    mangataAccount: string | KeyringPair,
    destinationAddress: string,
    amount: BN,
    txOptions?: XcmTxOptions
  ) {
    const correctAddress = encodeAddress(destinationAddress, 42);
    const destination = {
      V1: {
        parents: 1,
        interior: {
          X2: [
            {
              Parachain: 2114
            },
            {
              AccountId32: {
                network: "Any",
                id: api.createType("AccountId32", correctAddress).toHex()
              }
            }
          ]
        }
      }
    };

    await signTx(
      api,
      api.tx.xTokens.transfer("7", amount, destination, new BN("6000000000")),
      mangataAccount,
      txOptions
    );
  }

  static async activateLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.activateLiquidity(liquditityTokenId, amount, null),
      account,
      txOptions
    );
  }

  static async deactivateLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    liquditityTokenId: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.deactivateLiquidity(liquditityTokenId, amount),
      account,
      txOptions
    );
  }

  static async claimRewards(
    api: ApiPromise,
    account: string | KeyringPair,
    liquidityTokenId: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.claimRewards(liquidityTokenId, amount),
      account,
      txOptions
    );
  }

  static async createPool(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    firstTokenAmount: BN,
    secondTokenId: string,
    secondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.createPool(
        firstTokenId,
        firstTokenAmount,
        secondTokenId,
        secondTokenAmount
      ),
      account,
      txOptions
    );
  }

  static async sellAsset(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.sellAsset(soldTokenId, boughtTokenId, amount, minAmountOut),
      account,
      txOptions
    );
  }

  static async buyAsset(
    api: ApiPromise,
    account: string | KeyringPair,
    soldTokenId: string,
    boughtTokenId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.buyAsset(soldTokenId, boughtTokenId, amount, maxAmountIn),
      account,
      txOptions
    );
  }

  static async mintLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    firstTokenAmount: BN,
    expectedSecondTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.mintLiquidity(
        firstTokenId,
        secondTokenId,
        firstTokenAmount,
        expectedSecondTokenAmount
      ),
      account,
      txOptions
    );
  }

  static async burnLiquidity(
    api: ApiPromise,
    account: string | KeyringPair,
    firstTokenId: string,
    secondTokenId: string,
    liquidityTokenAmount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.xyk.burnLiquidity(
        firstTokenId,
        secondTokenId,
        liquidityTokenAmount
      ),
      account,
      txOptions
    );
  }

  static async transferToken(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    amount: BN,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    const result = await signTx(
      api,
      api.tx.tokens.transfer(address, tokenId, amount),
      account,
      txOptions
    );
    return result;
  }

  static async transferAllToken(
    api: ApiPromise,
    account: string | KeyringPair,
    tokenId: string,
    address: string,
    txOptions?: TxOptions
  ): Promise<MangataGenericEvent[]> {
    return await signTx(
      api,
      api.tx.tokens.transferAll(address, tokenId, true),
      account,
      txOptions
    );
  }
}
