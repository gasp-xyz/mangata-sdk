/* eslint-disable no-console */
import { GenericExtrinsic } from '@polkadot/types'
import fisherYatesShuffle from './fisherYatesShuffle'

const recreateExtrinsicsOrder = (extrinsics: GenericExtrinsic[], seedBytes: Uint8Array) => {
  const slots: string[] = extrinsics.map((extrinsic) =>
    extrinsic.isSigned ? extrinsic.signer.toString() : 'None'
  )

  fisherYatesShuffle(slots, seedBytes)

  const map = new Map()

  for (const e of extrinsics) {
    let who = 'None'
    if (e.isSigned) {
      who = e.signer.toString()
    }

    if (map.has(who)) {
      map.get(who).push(e)
    } else {
      map.set(who, [e])
    }
  }

  const shuffledExtrinsics = slots.map((who) => {
    return map.get(who).shift()
  })

  return shuffledExtrinsics
}
export default recreateExtrinsicsOrder
