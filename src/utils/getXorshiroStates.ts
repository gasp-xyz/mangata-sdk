import { XoShiRo256Plus } from "mangata-prng-xoshiro";

function getXoshiroStates(seed: Uint8Array) {
  const s0 =
    (BigInt(seed[0]) << BigInt(0)) |
    (BigInt(seed[1]) << BigInt(8)) |
    (BigInt(seed[2]) << BigInt(16)) |
    (BigInt(seed[3]) << BigInt(24)) |
    (BigInt(seed[4]) << BigInt(32)) |
    (BigInt(seed[5]) << BigInt(40)) |
    (BigInt(seed[6]) << BigInt(48)) |
    (BigInt(seed[7]) << BigInt(56));
  const s1 =
    (BigInt(seed[8]) << BigInt(0)) |
    (BigInt(seed[9]) << BigInt(8)) |
    (BigInt(seed[10]) << BigInt(16)) |
    (BigInt(seed[11]) << BigInt(24)) |
    (BigInt(seed[12]) << BigInt(32)) |
    (BigInt(seed[13]) << BigInt(40)) |
    (BigInt(seed[14]) << BigInt(48)) |
    (BigInt(seed[15]) << BigInt(56));
  const s2 =
    (BigInt(seed[16]) << BigInt(0)) |
    (BigInt(seed[17]) << BigInt(8)) |
    (BigInt(seed[18]) << BigInt(16)) |
    (BigInt(seed[19]) << BigInt(24)) |
    (BigInt(seed[20]) << BigInt(32)) |
    (BigInt(seed[21]) << BigInt(40)) |
    (BigInt(seed[22]) << BigInt(48)) |
    (BigInt(seed[23]) << BigInt(56));
  const s3 =
    (BigInt(seed[24]) << BigInt(0)) |
    (BigInt(seed[25]) << BigInt(8)) |
    (BigInt(seed[26]) << BigInt(16)) |
    (BigInt(seed[27]) << BigInt(24)) |
    (BigInt(seed[28]) << BigInt(32)) |
    (BigInt(seed[29]) << BigInt(40)) |
    (BigInt(seed[30]) << BigInt(48)) |
    (BigInt(seed[31]) << BigInt(56));

  return { s0, s1, s2, s3 };
}

export function getXoshiro(seed: Uint8Array) {
  const { s0, s1, s2, s3 } = getXoshiroStates(seed);
  return new XoShiRo256Plus(s0, s1, s2, s3);
}
