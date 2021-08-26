import { ApiPromise, WsProvider } from '@polkadot/api'
import type { DefinitionRpc, DefinitionRpcSub, RegistryTypes } from '@polkadot/types/types'
import BN from 'bn.js'
import { options } from './utils/options'
import rpcOptions from './utils/mangata-rpc'
import typesOptions from './utils/mangata-types'
import { RPC } from './services/Rpc'
import { TX } from './services/Tx'
import { Query } from './services/Query'
import { ApiOptions } from '@polkadot/api/types'

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
    address: string,
    firstAssetId: string,
    firstAssetAmount: BN,
    secondAssetId: string,
    secondAssetAmount: BN
  ) {
    const api = await this.connect()
    await TX.createPool(
      api,
      address,
      firstAssetId,
      firstAssetAmount,
      secondAssetId,
      secondAssetAmount
    )
  }

  /**
   * Sell asset
   */
  public async sellAsset(
    address: string,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    minAmountOut: BN
  ) {
    const api = await this.connect()
    await TX.sellAsset(api, address, soldAssetId, boughtAssetId, amount, minAmountOut)
  }

  /**
   * Mint liquidity
   */
  public async mintLiquidity(
    address: string,
    firstAssetId: string,
    secondAssetId: string,
    firstAssetAmount: BN,
    expectedSecondAssetAmount: BN
  ) {
    const api = await this.connect()
    await TX.mintLiquidity(
      api,
      address,
      firstAssetId,
      secondAssetId,
      firstAssetAmount,
      expectedSecondAssetAmount
    )
  }

  /**
   * Burn liquidity
   */
  public async burnLiquidity(
    address: string,
    firstAssetId: string,
    secondAssetId: string,
    liquidityAssetAmount: BN
  ) {
    const api = await this.connect()
    await TX.burnLiquidity(api, address, firstAssetId, secondAssetId, liquidityAssetAmount)
  }

  /**
   * Buy asset
   */
  public async buyAsset(
    address: string,
    soldAssetId: string,
    boughtAssetId: string,
    amount: BN,
    maxAmountIn: BN
  ) {
    const api = await this.connect()
    await TX.sellAsset(api, address, soldAssetId, boughtAssetId, amount, maxAmountIn)
  }
}

export class MangataApi {
  /**
   * Get api Options
   */
  public getApiOptions(provider: WsProvider): ApiOptions {
    return options({ provider })
  }

  /**
   * Get api rpc Options
   */
  public getMangataRpc(): Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>> {
    return rpcOptions
  }

  /**
   * Get api types Options
   */
  public getMangataTypes(): RegistryTypes {
    return typesOptions
  }
}
