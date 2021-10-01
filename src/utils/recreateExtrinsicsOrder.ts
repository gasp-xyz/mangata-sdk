import { GenericExtrinsic } from '@polkadot/types'
import fisherYatesShuffle from './fisherYatesShuffle'
import signerMap from './signerMap'

const recreateExtrinsicsOrder = (extrinsics: GenericExtrinsic[], seedBytes: Uint8Array) => {
  const slots: string[] = extrinsics.map((extrinsic) =>
    extrinsic.isSigned ? extrinsic.signer.toString() : 'None'
  )

  fisherYatesShuffle(slots, seedBytes)

  return slots.map((who) => signerMap(extrinsics).get(who)?.shift())
}

export default recreateExtrinsicsOrder
