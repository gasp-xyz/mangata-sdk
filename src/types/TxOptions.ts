import { Signer } from '@polkadot/types/types'
import type { ISubmittableResult } from '@polkadot/types/types'
import BN from 'bn.js'

export type TxOptions = Partial<{
  nonce: BN
  signer: Signer
  statusCallback: (result: ISubmittableResult) => void
}>
