/* eslint-disable no-console */
import { ApiPromise } from "@polkadot/api";
import { KeyringPair } from "@polkadot/keyring/types";
import { WsProvider } from "@polkadot/rpc-provider/ws";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { GenericExtrinsic, GenericEvent } from "@polkadot/types";
import { AnyTuple } from "@polkadot/types-codec/types";
import { BN, isHex, hexToU8a } from "@polkadot/util";
import { encodeAddress } from "@polkadot/util-crypto";
import { ISubmittableResult } from "@polkadot/types/types";

import { instance } from "../utils/MemoryDatabase";
import { getTxNonce } from "../utils/getTxNonce";
import { Query } from "../services/Query";
import { TxOptions, XcmTxOptions } from "../types/TxOptions";
import { MangataGenericEvent } from "../types/MangataGenericEvent";
import { MangataEventData } from "../types/MangataEventData";
import { truncatedString } from "../utils/truncatedString";
import { DepositXcmTuple, WithdrawXcmTuple } from "../types/AssetInfo";
import { getWeightXTokens } from "../utils/getWeightXTokens";
import { getCorrectLocation } from "../utils/getCorrectLocation";

function serializeTx(api: ApiPromise, tx: SubmittableExtrinsic<"promise">) {
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
}

export const signTx = async (
  api: ApiPromise,
  tx: SubmittableExtrinsic<"promise">,
  account: string | KeyringPair,
  txOptions?: TxOptions
): Promise<MangataGenericEvent[]> => {
  return new Promise<MangataGenericEvent[]>(async (resolve, reject) => {
    const extractedAccount =
      typeof account === "string" ? account : account.address;

    const nonce = await getTxNonce(api, extractedAccount, txOptions);
    await tx.signAsync(account, { nonce, signer: txOptions?.signer });
    console.info(
      `submitting Tx[${tx.hash.toString()}]who: ${extractedAccount} nonce: ${nonce.toString()} `
    );
    try {
      const unsub = await tx.send(async (result: ISubmittableResult) => {
        console.info(
          `Tx[${tx.hash.toString()}]who: ${extractedAccount} nonce: ${nonce.toString()} => ${
            result.status.type
          }(${result.status.value.toString()})${serializeTx(api, tx)}`
        );

        txOptions?.statusCallback?.(result);
        if (result.status.isInBlock) {
          const inclusionBlockHash = result.status.asInBlock.toString();
          const inclusionBlockHeader = await api.rpc.chain.getHeader(
            inclusionBlockHash
          );
          const inclusionBlockNr = inclusionBlockHeader.number.toBn();
          const executionBlockStartNr = inclusionBlockNr.addn(1);
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
                const currentNonce: BN = await Query.getNonce(
                  api,
                  extractedAccount
                );
                instance.setNonce(extractedAccount, currentNonce);
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
                const events = await api.query.system.events.at(
                  blockHeader.hash
                );

                //increment
                executionBlockNr.iaddn(1);

                const index = extinsics.findIndex((extrinsic) => {
                  return extrinsic.hash.toString() === tx.hash.toString();
                });

                if (index < 0) {
                  console.info(
                    `Tx([${tx.hash.toString()}]) not found in block ${executionBlockNr} $([${truncatedString(
                      blockHash.toString()
                    )}])`
                  );
                  return;
                } else {
                  unsubscribeNewHeads();
                  console.info(
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
                      error: getError(api, event.method, eventData)
                    } as MangataGenericEvent;
                  });

                txOptions?.extrinsicStatus?.(eventsTriggeredByTx);
                resolve(eventsTriggeredByTx);
                unsub();
              }
            }
          );
        } else if (result.isError) {
          console.info(
            "Transaction Error Result",
            JSON.stringify(result, null, 2)
          );
          reject(`Tx([${tx.hash.toString()}]) Transaction error`);
          const currentNonce: BN = await Query.getNonce(api, extractedAccount);
          instance.setNonce(extractedAccount, currentNonce);
        }
      });
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

    const destWeightLimit = getWeightXTokens(
      new BN("6000000000"),
      api.tx.xTokens.transfer
    );

    await api.tx.xTokens
      .transfer("4", amount, destination, destWeightLimit)
      .signAndSend(mangataAccount, {
        signer: txOptions?.signer,
        nonce: txOptions?.nonce
      });
  }

  static async sendTokenFromParachainToMangata(...args: DepositXcmTuple) {
    const [
      mangataApi,
      url,
      tokenSymbol,
      destWeight,
      account,
      mangataAddress,
      amount,
      txOptions
    ] = args;
    const provider = new WsProvider(url);
    const api = await new ApiPromise({ provider }).isReady;
    const correctMangataAddress = encodeAddress(mangataAddress, 42);

    const assetRegistryMetadata =
      await mangataApi.query.assetRegistry.metadata.entries();

    const assetMetadata = assetRegistryMetadata.find((metadata) => {
      const symbol = metadata[1].value.symbol.toPrimitive();
      return symbol === tokenSymbol;
    });

    if (assetMetadata && assetMetadata[1].value.location) {
      const { location } = assetMetadata[1].unwrap();
      const decodedLocation = JSON.parse(location.toString());

      const asset = {
        V1: {
          id: {
            Concrete: getCorrectLocation(tokenSymbol, decodedLocation)
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
                  id: api
                    .createType("AccountId32", correctMangataAddress)
                    .toHex()
                }
              }
            ]
          }
        }
      };

      const destWeightLimit = getWeightXTokens(
        new BN(destWeight),
        api.tx.xTokens.transferMultiasset
      );

      await api.tx.xTokens
        .transferMultiasset(asset, destination, destWeightLimit)
        .signAndSend(account, {
          signer: txOptions?.signer,
          nonce: txOptions?.nonce
        });
    }
  }

  static async sendTokenFromMangataToParachain(...args: WithdrawXcmTuple) {
    const [
      api,
      tokenSymbol,
      withWeight,
      parachainId,
      account,
      destinationAddress,
      amount,
      txOptions
    ] = args;
    const correctAddress = encodeAddress(destinationAddress, 42);

    const assetRegistryMetadata =
      await api.query.assetRegistry.metadata.entries();

    const assetMetadata = assetRegistryMetadata.find((metadata) => {
      const symbol = metadata[1].value.symbol.toPrimitive();
      return symbol === tokenSymbol;
    });

    if (assetMetadata && assetMetadata[1].value.location) {
      const tokenId = (assetMetadata[0].toHuman() as string[])[0].replace(
        /[, ]/g,
        ""
      );

      const destination = {
        V1: {
          parents: 1,
          interior: {
            X2: [
              {
                Parachain: parachainId
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

      const destWeightLimit = getWeightXTokens(
        new BN(withWeight),
        api.tx.xTokens.transfer
      );

      await signTx(
        api,
        api.tx.xTokens.transfer(tokenId, amount, destination, destWeightLimit),
        account,
        txOptions
      );
    }
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

    const destWeightLimit = getWeightXTokens(
      new BN("4000000000"),
      api.tx.xTokens.transferMultiasset
    );

    await turingApi.tx.xTokens
      .transferMultiasset(asset, destination, destWeightLimit)
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
      api.tx.xyk.activateLiquidityV2(liquditityTokenId, amount, null),
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
      api.tx.xyk.deactivateLiquidityV2(liquditityTokenId, amount),
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
      api.tx.xyk.claimRewardsV2(liquidityTokenId, amount),
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
