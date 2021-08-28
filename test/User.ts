import { Keyring } from '@polkadot/api'
import { KeyringPair } from '@polkadot/keyring/types'
import { v4 as uuid } from 'uuid'
import BN from 'bn.js'
import { Mangata } from '../src'

export class User {
  keyRingPair: KeyringPair
  name: string
  keyring: Keyring
  assets: Asset[]
  mangata: Mangata

  constructor(mangata: Mangata, keyring: Keyring, name: string = '', json: any = undefined) {
    this.mangata = mangata
    if (!name) {
      name = '//testUser_' + uuid()
    }
    this.name = name
    this.keyring = keyring
    if (json) {
      this.keyRingPair = keyring.createFromJson(json)
    } else {
      this.keyRingPair = keyring.createFromUri(name)
    }
    this.assets = []
  }

  public addAsset(currencyId: BN, amountBefore: BN = new BN(0)) {
    const asset = new Asset(currencyId, amountBefore)
    if (this.assets.find((asset) => asset.currencyId === currencyId) === undefined) {
      this.assets.push(asset)
    }
  }
}

export class Asset {
  amountBefore: BN
  amountAfter: BN
  currencyId: BN

  constructor(currencyId: BN, amountBefore = new BN(0), amountAfter = new BN(0)) {
    this.currencyId = currencyId
    this.amountBefore = amountBefore
    this.amountAfter = amountAfter
  }
}
