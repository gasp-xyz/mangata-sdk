import { GenericExtrinsic } from '@polkadot/types'

const signerMap = (extrinsics: GenericExtrinsic[]) => {
  const signerMap = new Map<string, GenericExtrinsic[]>()

  for (const extrinsic of extrinsics) {
    const who = extrinsic.isSigned ? extrinsic.signer.toString() : 'None'
    signerMap.has(who) ? signerMap.get(who)?.push(extrinsic) : signerMap.set(who, [extrinsic])
  }

  return signerMap
}

export default signerMap
