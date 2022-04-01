/* eslint-disable no-console */
import { FisherYates } from './fisherYatesShuffle'

const recreateExtrinsicsOrder = <K>(extrinsics: [string, K][], seedBytes: Uint8Array) => {
  let result: K[] = []
  const fy = new FisherYates(seedBytes)

  const map = new Map()
  extrinsics.forEach((info) => {
    const who = info[0]
    const tx = info[1]
    if (map.has(who)) {
      map.get(who).push(tx)
    } else {
      map.set(who, [tx])
    }
  })

  while (map.size != 0) {
    const slots: K[] = []

    const keys = []
    for (const entry of map.entries()) {
      keys.push(entry[0])
    }
    keys.sort()

    for (const key of keys) {
      const values = map.get(key)
      slots.push(values.shift())
      if (values.length == 0) {
        map.delete(key)
      }
    }
    fy.shuffle(slots)
    result = result.concat(slots)
  }
  return result
}

export default recreateExtrinsicsOrder
