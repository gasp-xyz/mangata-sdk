import { ApiPromise, WsProvider } from '@polkadot/api'
import { GenericEvent } from '@polkadot/types'
import { KeyringPair } from '@polkadot/keyring/types'
import type { DefinitionRpc, DefinitionRpcSub, RegistryTypes } from '@polkadot/types/types'
import { ApiOptions } from '@polkadot/api/types'
import BN from 'bn.js'

import { options } from './utils/options'
import rpcOptions from './utils/mangata-rpc'
import typesOptions from './utils/mangata-types'
import { RPC } from './services/Rpc'
import { TX } from './services/Tx'
import { Query } from './services/Query'
import { txOptions } from './services/types'

/**
 * The Mangata class defines the `getInstance` method that lets clients access the unique singleton instance. Design pattern Singleton Promise is used.
 */
export class Mangata {
  private static instance: Mangata
  private apiPromise: Promise<ApiPromise> | null
  private uri: string

  /**
   * The Mangata's constructor is private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(uri: string) {
    this.apiPromise = null
    this.uri = uri
  }

  /**
   * Initialised via isReady & new with specific provider
   */
  private async connect() {
    if (!this.apiPromise) {
      const provider = new WsProvider(this.uri)
      this.apiPromise = new ApiPromise(options({ provider })).isReady
    }

    return this.apiPromise
  }

  /**
   * The static method that controls the access to the Mangata instance.
   */
  public static getInstance(uri: string): Mangata {
    if (!Mangata.instance) {
      Mangata.instance = new Mangata(uri)
    }

    return Mangata.instance
  }

  /**
   * Retrieve the underlying API
   */
  public async getApi(): Promise<ApiPromise> {
    return await this.connect()
  }

  /**
   * Retrieve the chain name
   */

  public async getChain(): Promise<string> {
    const api = await this.connect()
    return RPC.getChain(api)
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<string> {
    const api = await this.connect()
    return RPC.getNodeName(api)
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<string> {
    const api = await this.connect()
    return RPC.getNodeVersion(api)
  }

  /**
   * Retrieve the current nonce
   */

  public async getNonce(address: string): Promise<BN> {
    const api = await this.connect()
    return Query.getNonce(api, address)
  }

  /**
   * Disconnect
   */

  public async disconnect(): Promise<void> {
    const api = await this.connect()
    api.disconnect()
  }

  /**
   * Create a pool
   */

  public async createPool(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.createPool(
      api,
      keyRingPair,
      firstAssetId,
      firstAssetAmount,
      secondAssetId,
      secondAssetAmount,
      txOptions
    )
  }

  /**
   * Sell asset
   */
  public async sellAsset(
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.sellAsset(
      api,
      keyRingPair,
      soldAssetId,
      boughtAssetId,
      amount,
      minAmountOut,
      txOptions
    )
  }

  /**
   * Mint liquidity
   */
  public async mintLiquidity(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.mintLiquidity(
      api,
      keyRingPair,
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount,
      txOptions
    )
  }

  /**
   * Burn liquidity
   */
  public async burnLiquidity(
    keyRingPair: KeyringPair,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.burnLiquidity(
      api,
      keyRingPair,
      firstAssetId,
      secondAssetId,
      liquidityAssetAmount,
      txOptions
    )
  }

  /**
   * Buy asset
   */
  public async buyAsset(
    keyRingPair: KeyringPair,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.sellAsset(
      api,
      keyRingPair,
      soldAssetId,
      boughtAssetId,
      amount,
      maxAmountIn,
      txOptions
    )
  }

  public async createToken(
    targetAddress: string,
    sudoKeyringPair: KeyringPair,
    currencyValue: BN,
    txOptions?: txOptions
  ): Promise<GenericEvent[]> {
    const api = await this.connect()
    return await TX.createToken(api, targetAddress, sudoKeyringPair, currencyValue, txOptions)
  }

  public async waitNewBlock(forceWait = false) {
    const api = await this.connect()
    let count = 0
    return new Promise(async (resolve) => {
      const unsubscribe = await api.rpc.chain.subscribeNewHeads(() => {
        if (!forceWait || ++count === 2) {
          unsubscribe()
          resolve(true)
        }
      })
    })
  }
}

export const getApiOptions = (provider: WsProvider): ApiOptions => {
  return options({ provider })
}

export const getMangataRpc = (): Record<
  string,
  Record<string, DefinitionRpc | DefinitionRpcSub>
> => {
  return rpcOptions
}

export const getMangataTypes = (): RegistryTypes => {
  return typesOptions
}
