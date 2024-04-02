/*
 * All sorting algorithms specific to linear collections: arrays, linked lists,
 * stacks, queues, etc..
 */

import { Collection, Index } from "../util";

export type SwapFunction<ElementType> = (
  collection: Collection<ElementType>,
  fromIndex: Index,
  toIndex: Index,
) => void;

export type CopyToFunction<ElementType> = (
  fromCollection: Collection<ElementType>,
  toCollection: Collection<ElementType>,
  fromIndex: Index,
  toIndex: Index,
) => void;

export type NewFunction<ElementType> = (
  length: number,
) => Collection<ElementType>;

/* Selection Sort: Iterates over the collection from beginning to end, sending
 * the minimum element found per iteration to the beginning before starting the
 * next iteration from the new start index. It repeats this process until it
 * reaches the end of the list.
 */
export function selectionSort<ElementType>(
  collection: Collection<ElementType>,
  swapFunction: SwapFunction<ElementType>,
) {
  let minimum: ElementType | undefined;
  let minimumIndex: Index | undefined;
  for (let i = 0; i < collection.length; i++) {
    minimum = undefined;
    minimumIndex = undefined;
    // Stryker disable next-line EqualityOperator: null reference
    for (let j = i; j < collection.length; j++) {
      const next = collection.at(j);
      if (minimum === undefined) {
        minimum = next;
        minimumIndex = j;
        continue;
      }
      // Stryker disable next-line EqualityOperator: cannot test with immutable elements, not critical
      if (minimum! > next!) {
        minimum = next;
        minimumIndex = j;
        continue;
      }
    }
    // Stryker disable next-line all: optimization, not critical
    if (minimumIndex === i) {
      // no need for a swap, since the minimum is already in the correct spot
      continue;
    }
    swapFunction(collection, minimumIndex!, i);
  }
}

/* Bubble Sort: Iterates over the collection from beginning to end, swapping
 * each pair of elements as it goes depending on which of the two elements is
 * smaller. The end point of each successive iteration gradually approaches the
 * beginning of the list as the sort continues, and the list is sorted when the
 * beginning of the list is reached.
 */
export function bubbleSort<ElementType>(
  collection: Collection<ElementType>,
  swapFunction: SwapFunction<ElementType>,
) {
  // Stryker disable ArithmeticOperator, EqualityOperator
  for (let i = collection.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (collection.at(j)! > collection.at(j + 1)!) {
        swapFunction(collection, j, j + 1);
      }
    }
  }
  // Stryker enable all
}

/* Merge Sort (Recursive): Recursive algorithm which sorts a list by performing
 * a sort and merge operation on two halves of a sublist. The sort is applied
 * by performing a comparison and swapping the position of two elements (two
 * single-element sublists).
 */
export function mergeSort<ElementType>(
  collection: Collection<ElementType>,
  copyToFunction: CopyToFunction<ElementType>,
  newFunction: NewFunction<ElementType>,
): void {
  const helper: Collection<ElementType> = newFunction(collection.length);

  function merge(low: Index, middle: Index, high: Index): void {
    // Overwrite the relevant portion of the helper array (low <= i <= high)
    // with elements from the input array
    for (let i = low; i <= high; i++) {
      copyToFunction(collection, helper, i, i);
    }
    let helperLeftLow = low;
    let helperRightLow = middle + 1;
    let current = low;
    // Merge from the helper array into the original array, selecting between
    // the lowest unmerged elements of each subarray with each iteration.
    while (helperLeftLow <= middle && helperRightLow <= high) {
      if (helper.at(helperLeftLow)! <= helper.at(helperRightLow)!) {
        copyToFunction(helper, collection, helperLeftLow, current);
        helperLeftLow += 1;
      } else {
        copyToFunction(helper, collection, helperRightLow, current);
        helperRightLow += 1;
      }
      current += 1;
    }
    // Merge the remaining elements, which will always be from the left subarray
    // if present, since we are merging from lowest value to highest.
    const remaining = middle - helperLeftLow;
    for (let i = 0; i <= remaining; i++) {
      copyToFunction(helper, collection, helperLeftLow + i, current + i);
    }
  }

  function mergeSortInner(low: Index, high: Index): void {
    if (low >= high) {
      // 1-element array is already sorted
      return;
    }
    // Divide
    const middle: Index = low + Math.floor((high - low) / 2);
    // Conquer
    mergeSortInner(low, middle);
    mergeSortInner(middle + 1, high);
    // Combine
    merge(low, middle, high);
  }

  // Initial sort call
  mergeSortInner(0, collection.length - 1);
}
