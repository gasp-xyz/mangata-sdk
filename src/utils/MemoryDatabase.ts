/* eslint-disable no-console */
import { BN } from '@polkadot/util'
import { Database } from '../types'

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
    return this.db[address] ? true : false
  }

  public setNonce = (address: string, nonce: BN): void => {
    this.db[address] = nonce
  }

  public getNonce = (address: string): BN => {
    return this.db[address]
  }
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const instance = InMemoryDatabase.getInstance()
