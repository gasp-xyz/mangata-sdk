import BN from 'bn.js'

interface Database {
  hasAddressNonce(address: string): boolean
  setNonce(address: string, nonce: BN): void
  getNonce(address: string): BN
}

class InMemoryDatabase implements Database {
  static instance: InMemoryDatabase
  private db: Record<string, BN> = {}

  private constructor() {}

  public static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase()
    }

    return InMemoryDatabase.instance
  }

  public hasAddressNonce = (address: string): boolean => {
    return this.db[address] ? false : true
  }

  public setNonce = (address: string, nonce: BN): void => {
    this.db[address] = nonce
  }

  public getNonce = (address: string): BN => {
    return this.db[address]
  }
}

export default InMemoryDatabase.getInstance()
