import { Codec } from '@polkadot/types/types'

export interface MangataEventData {
  type: string
  data: Codec
}
