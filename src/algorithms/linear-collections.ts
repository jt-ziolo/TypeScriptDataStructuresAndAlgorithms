/*
 * All algorithms specific to linear collections: arrays, linked lists, stacks,
 * queues, etc.
 */

// Defined for clarity (BDD)
export type Index = number;

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
