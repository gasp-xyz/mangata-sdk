// Replacement for the native `toFixed` function which solves the
// issue that the native one rounds the numbers by default.
export const toFixed = (value: string, decimals: number) => {
  // This expression matches:
  // 1. Minus sign (optional)
  // 2. Any amount of digits
  // 3. A decimal separator and the desired amount of decimal digits (optional)
  const decimalsRegex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`, "gm");
  const withDesiredDecimalPlaces = value.match(decimalsRegex);
  // However there can be some trailing zeroes
  // This expression matches:
  // 1. Everything except trailing zeroes
  // Source: https://www.reddit.com/r/regex/comments/dl2nug/comment/f4m8o9w/?utm_source=share&utm_medium=web2x&context=3
  const trailingZeroesRegex = /^-?0*(\d+(?:\.(?:(?!0+$)\d)+)?)/gm;
  const withoutTrailingZeroes = (withDesiredDecimalPlaces?.[0] || value).match(
    trailingZeroesRegex
  );

  return withoutTrailingZeroes?.[0] ?? value;
};
