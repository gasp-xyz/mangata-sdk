import type { Event, Phase } from '@polkadot/types/interfaces'
import { MangataEventData } from './MangataEventData'

export interface MangataGenericEvent {
  event: Event
  phase: Phase
  section: string
  method: string
  metaDocumentation: string
  eventData: MangataEventData[]
}
