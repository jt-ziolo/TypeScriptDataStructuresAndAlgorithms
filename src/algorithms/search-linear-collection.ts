/*
 * All search algorithms specific to linear collections: arrays, linked lists,
 * stacks, queues, etc.
 */

import { Index } from "../util";

/* Simple linear search which iterates over the collection from beginning to
 * end while searching for a value. Returns the index of the element, if found,
 * otherwise returns -1.
 */
export function linearSearch<ElementType>(
  collection: Iterable<ElementType>,
  predicate: (element: ElementType) => boolean,
): Index {
  let idx: Index = 0;
  for (const element of collection) {
    if (predicate(element)) {
      return idx;
    }
    idx += 1;
  }
  return -1;
}

/* Binary search which searches for a value based on comparisons against
 * midpoints. Returns the index of the element, if found, otherwise returns -1.
 */
export function binarySearch<
  CollectionType extends RelativeIndexable<ElementType> & { length: number },
  ElementType,
>(
  collection: CollectionType,
  predicate: (element: ElementType) => number,
): Index {
  const isLessThan = (idx: Index) => {
    return predicate(collection.at(idx)!) < 0;
  };
  const isGreaterThan = (idx: Index) => {
    return predicate(collection.at(idx)!) > 0;
  };

  let low: Index = 0;
  let high: Index = collection.length - 1;
  let mid: Index;
  while (low <= high) {
    mid = low + Math.floor((high - low) / 2);
    if (isGreaterThan(mid)) {
      low = mid + 1;
    } else if (isLessThan(mid)) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}
