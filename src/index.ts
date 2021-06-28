import { ApiPromise, WsProvider } from '@polkadot/api'
import { options } from './options'

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
   * Retrieve the chain name
   */

  public async getChain(): Promise<string> {
    const api = await this.connect()
    const chain = await api.rpc.system.chain()
    return chain.toHuman()
  }

  /**
   * Retrieve the node name
   */

  public async getNodeName(): Promise<string> {
    const api = await this.connect()
    const name = await api.rpc.system.name()
    return name.toHuman()
  }

  /**
   * Retrieve the node version
   */

  public async getNodeVersion(): Promise<string> {
    const api = await this.connect()
    const version = await api.rpc.system.version()
    return version.toHuman()
  }
}
