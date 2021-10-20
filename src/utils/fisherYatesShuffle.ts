/* eslint-disable no-console */
import { getXoshiro } from './getXorshiroStates'

const fisherYatesShuffle = <K>(arr: K[], seed: Uint8Array) => {
  const xoshiro = getXoshiro(seed)
  // Start from the last element and swap
  // one by one. We don't need to run for
  // the first element that's why i > 0
  for (let i = arr.length - 1; i > 0; i--) {
    // The number 4294967295, equivalent to the hexadecimal value FFFFFFFF, is the
    // maximum value for a 32-bit unsigned integer in computing.
    const j: number = Number(xoshiro.nextBigInt(BigInt(4294967295))) % i
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}

export default fisherYatesShuffle
