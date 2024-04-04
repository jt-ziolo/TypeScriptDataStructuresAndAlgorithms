import { ExpectedPositiveIntegerError } from "../error";
import { Collection, Index } from "../util";
import { CopyToFunction } from "./sort-linear-collection";

/* Radix Sort: Sorts elements lexicographically by distributing them into
 * "bins". The data must be represented in a way that falls into a fixed set of
 * bins. This implementation works on arrays of positive integers, sorting them using
 * their digits starting from the least significant digit.
 */
export const getNumberOfDigits = (value: number) => {
  // 10^n is < the input until n equals the number of digits of the input (only
  // works for positive integers)
  if (!Number.isInteger(value) || value < 0) {
    throw new ExpectedPositiveIntegerError(value);
  }
  let exp = 1;
  while (10 ** exp <= value) {
    exp += 1;
  }
  return exp;
};

export const getDigit = (value: number, fromRightIdx: Index) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new ExpectedPositiveIntegerError(value);
  }
  if (!Number.isInteger(fromRightIdx) || fromRightIdx < 0) {
    throw new ExpectedPositiveIntegerError(fromRightIdx);
  }
  if (10 ** fromRightIdx > value) {
    return 0;
  }
  const str = value.toString();
  return parseInt(str[str.length - 1 - fromRightIdx]);
};

export const radixSort = (
  collection: Collection<number>,
  copyToFunction: CopyToFunction<number>,
): void => {
  // find the maximum number of digits
  let max = 0;
  for (const element of collection) {
    // Stryker disable next-line EqualityOperator: not essential, little difference between < and <=
    if (max < element) {
      max = element;
    }
  }
  const maxNumberOfDigits = getNumberOfDigits(max);

  // Stryker disable next-line EqualityOperator: not essential, 0 is prepended if using <=
  for (let i = 0; i < maxNumberOfDigits; i++) {
    const bins = Array.from({ length: 10 }, () => {
      return new Array<number>();
    });

    for (const element of collection) {
      const digit = getDigit(element, i);
      bins[digit].push(element);
    }
    // flatten the bins array and copy it to the result array prior to the next
    // loop
    const flattened = bins.flat();
    for (let j = 0; j < collection.length; j++) {
      copyToFunction(flattened, collection, j, j);
    }
  }
};
