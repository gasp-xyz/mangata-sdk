import { XoShiRo256Plus } from 'prng-xoshiro/src/xoshiro256'

function bufToBn(buf: Uint8Array): bigint {
  const hex: any[] = []
  const u8 = Uint8Array.from(buf)

  u8.forEach(function (i) {
    let h = i.toString(16)
    if (h.length % 2) {
      h = '0' + h
    }
    hex.push(h)
  })

  return BigInt('0x' + hex.join(''))
}

function bnToBuf(bn: bigint) {
  let hex = BigInt(bn).toString(16)
  if (hex.length % 2) {
    hex = '0' + hex
  }

  const len = hex.length / 2
  const u8 = new Uint8Array(len)

  let i = 0
  let j = 0
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16)
    i += 1
    j += 2
  }

  return u8
}

const fisherYatesShuffle = <K>(arr: K[], seed: Uint8Array) => {
  // Creates a new generator. seed will be used to seed a splitMix64 generator,
  // whose output will in turn be used to seed this generator.
  // Peek method returns the next random number without altering
  // the state of the generator.
  const pseudoRandomNumberGenerator = new XoShiRo256Plus(bufToBn(seed))
  // Start from the last element and swap
  // one by one. We don't need to run for
  // the first element that's why i > 0
  for (let i = arr.length - 1; i > 0; i--) {
    const j: number = Number(pseudoRandomNumberGenerator.peek()) % i
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
  }
}

export default fisherYatesShuffle
