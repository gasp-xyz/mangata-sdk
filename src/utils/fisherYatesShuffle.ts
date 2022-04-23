import { BN } from "@polkadot/util";

import { getXoshiro } from "./getXorshiroStates";

export class FisherYates {
  // TODO: make not any
  // xoshiro: XoShiRo256Plus;
  xoshiro: any;

  constructor(seed: Uint8Array) {
    this.xoshiro = getXoshiro(seed);
  }

  next_u64(): BN {
    // compute u64 same way as on the rust side
    const first = new BN(
      this.xoshiro.nextBigInt(BigInt(0xffffffff)).toString()
    );
    const second = new BN(
      this.xoshiro.nextBigInt(BigInt(0xffffffff)).toString()
    );
    return first.shln(32).or(second);
  }

  shuffle = <K>(arr: K[]) => {
    // Start from the last element and swap
    // one by one. We don't need to run for
    // the first element that's why i > 0
    for (let i = arr.length - 1; i > 0; i--) {
      // The number 4294967295, equivalent to the hexadecimal value FFFFFFFF, is the
      // maximum value for a 32-bit unsigned integer in computing.
      const random = this.next_u64();
      const j = random.modn(i + 1);
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
  };
}
