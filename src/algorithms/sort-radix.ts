import { Index } from "../util";

/* Radix Sort: Sorts elements lexicographically by distributing them into
 * "bins". The data must be represented in a way that falls into a fixed set of
 * bins. This implementation works on arrays of positive integers, sorting them using
 * their digits starting from the least significant digit.
 */
export const getNumberOfDigits = (value: number) => {
  // 10^n is < the input until n equals the number of digits of the input (only
  // works for positive integers)
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Expected positive integer: ${value}`);
  }
  if (value === 10) {
    return 2;
  }
  let exp = 1;
  while (10 ** exp < value) {
    exp += 1;
  }
  return exp;
};

export const getDigit = (value: number, fromRightIdx: Index) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Expected positive integer for "value": ${value}`);
  }
  if (!Number.isInteger(fromRightIdx) || fromRightIdx < 0) {
    throw new Error(`Expected positive integer for "fromRightIdx": ${value}`);
  }
  const dividend = value / 10 ** (fromRightIdx + 1);
  const asDecimal = dividend - Math.floor(dividend);
  return Math.floor(asDecimal * 10);
};
