import BN from 'bn.js'

export interface Database {
  hasAddressNonce(address: string): boolean
  setNonce(address: string, nonce: BN): void
  getNonce(address: string): BN
}
