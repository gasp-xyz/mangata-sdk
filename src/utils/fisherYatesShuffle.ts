import xoshiro, { PrngState } from 'xoshiro'

const fisherYatesShuffle = <K>(arr: K[], seed: Uint8Array) => {
  // create a pseudo random number generator with an algorithm (256+) and a seed
  // '256+' xoshiro256+, requires the seed to be of at least 32 bytes
  // using prng.roll() we can generate random number
  const pseudoRandomNumberGenerator: PrngState = xoshiro.create('256+', seed)
  // Start from the last element and swap
  // one by one. We don't need to run for
  // the first element that's why i > 0
  for (let i = arr.length - 1; i > 0; i--) {
    const j: number = pseudoRandomNumberGenerator.roll() % i
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}

export default fisherYatesShuffle
