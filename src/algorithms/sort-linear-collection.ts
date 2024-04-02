/*
 * All sorting algorithms specific to linear collections: arrays, linked lists,
 * stacks, queues, etc.
 */

import { Collection, Index } from "../util";

/* Selection sort: iterates over the collection from beginning to end, sending
 * the minimum element found per iteration to the beginning before starting the
 * next iteration from the new start index. It repeats this process until it
 * reaches the end of the list.
 */
export function selectionSort<ElementType>(
  collection: Collection<ElementType>,
  swapFunction: (
    collection: Collection<ElementType>,
    fromIndex: Index,
    toIndex: Index,
  ) => void,
) {
  let minimum: ElementType | undefined;
  let minimumIndex: Index | undefined;
  for (let i = 0; i < collection.length; i++) {
    minimum = undefined;
    minimumIndex = undefined;
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
