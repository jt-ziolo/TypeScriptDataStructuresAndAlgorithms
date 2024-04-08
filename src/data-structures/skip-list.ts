/* Skip List: A data structure consisting of ordered link lists. Each
 * successive list contains fewer and fewer elements, chosen randomly. During a
 * search operation, lists are traversed from the sparser lists (express lanes)
 * down to the normal lane which contains all elements.
 */

import {
  CollectionConstructor,
  CollectionCopyToFunction,
  mergeSort,
} from "../algorithms/sort-linear-collection";
import { Collection, HasLength, isSorted } from "../util";
import { LinkedNode } from "./linked-list";

export type ProbabilityFunction = () => boolean;

export class SkipListNode<T> implements LinkedNode<T> {
  data: T;
  next?: SkipListNode<T>;
  down?: SkipListNode<T>;
  nextWidth?: number;

  constructor(data: T) {
    this.data = data;
  }
}

export class SkipList<T> implements HasLength {
  head?: SkipListNode<T>;
  #probabilityFunction: ProbabilityFunction;

  constructor(
    probabilityFunction: ProbabilityFunction,
    collectionParams?: {
      collection: Collection<T>;
      copyToFunction: CollectionCopyToFunction<T>;
      constructor: CollectionConstructor<T>;
    },
  ) {
    this.#probabilityFunction = probabilityFunction;
    const collection = collectionParams?.collection;
    if (collection === undefined || collection.length === 0) {
      return;
    }

    // ensure the input collection is ordered
    if (!isSorted(collection)) {
      mergeSort(
        collection,
        collectionParams!.copyToFunction,
        collectionParams!.constructor,
      );
    }

    this.head = new SkipListNode<T>(collection.at(0)!);
    for (
      let node = this.head, i = 1, length = collection.length;
      i < length;
      i++
    ) {
      node.next = new SkipListNode<T>(collection.at(i)!);
      node.nextWidth = 1;
      node = node.next;
    }
  }

  get length(): number {
    let count = 0;
    for (let node = this.head; node !== undefined; node = node.next) {
      count++;
    }
    return count;
  }

  search(value: T) {
    throw new Error("Not yet implemented.");
  }

  insert(value: T) {
    throw new Error("Not yet implemented.");
  }

  remove(value: T) {
    throw new Error("Not yet implemented.");
  }
}
