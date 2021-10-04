import { Signer } from '@polkadot/types/types'
import type { ExtrinsicStatus } from '@polkadot/types/interfaces'
import BN from 'bn.js'

export type TxOptions = Partial<{
  nonce: BN
  signer: Signer
  statusCallback: (status: ExtrinsicStatus) => void
}>
