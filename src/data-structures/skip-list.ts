/* Skip List: A data structure consisting of ordered link lists. Each
 * successive list contains fewer and fewer elements, chosen randomly. During a
 * search operation, lists are traversed from the sparser lists (express lanes)
 * down to the normal lane which contains all elements.
 */

import { mergeSort } from "../algorithms/sort-linear-collection";
import {
  Collection,
  CollectionConstructor,
  CollectionCopyToFunction,
  HasLength,
  deleteObjectProperties,
  isSorted,
} from "../util";
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
  readonly #probabilityFunction: ProbabilityFunction;
  readonly #maxPromotions: number;

  constructor(
    probabilityFunction: ProbabilityFunction,
    collectionParams?: {
      collection: Collection<T>;
      copyToFunction: CollectionCopyToFunction<T>;
      constructor: CollectionConstructor<T>;
    },
    maxPromotions: number = Infinity,
  ) {
    this.#probabilityFunction = probabilityFunction;
    this.#maxPromotions = maxPromotions;
    const collection = collectionParams?.collection;
    if (collection === undefined) {
      return;
    }

    for (const item of collection) {
      this.insert(item);
    }
  }

  get length(): number {
    if (this.head === undefined) {
      return 0;
    }
    let count = 1;
    let node: SkipListNode<T> = this.head;
    while (node.down !== undefined) {
      node = node.down;
    }
    while (node.next !== undefined) {
      node = node.next;
      count += 1;
    }
    return count;
  }

  search(value: T) {
    throw new Error("Not yet implemented.");
  }

  insert(value: T) {
    if (this.head === undefined) {
      this.head = new SkipListNode<T>(value);
      return;
    }

    // traverse the list, tracking the nodes that we descend from as we go
    let node = this.head;
    let previousNode = undefined;
    const descendedNodesByLayer: Array<SkipListNode<T>> = [];
    while (node !== undefined) {
      if (node.data === value) {
        // do not insert duplicate nodes into a skip list
        return;
      }
      // Stryker disable next-line EqualityOperator: previous clause checks equality
      if (node.data < value) {
        previousNode = node;
        if (node.next !== undefined) {
          // check next node in current layer
          node = node.next;
        } else if (node.down !== undefined) {
          // descend
          descendedNodesByLayer.push(node);
          node = node.down;
          previousNode = undefined;
        } else {
          // we are at the end of the list on the bottom layer
          // insert after the current node
          const insertedNode = this.#insertAfter(value, node);
          this.#setupPromotions(insertedNode, descendedNodesByLayer);
          return;
        }
        continue;
      }
      // node.data > value
      if (node === this.head || previousNode === undefined) {
        // insert value as new head
        this.#insertAsHead(value);
        return;
      }
      // traverse to the bottom layer at the previous node
      while (previousNode.down !== undefined) {
        descendedNodesByLayer.push(previousNode);
        previousNode = previousNode.down;
      }
      node = previousNode.next!;
      // find the node that occurs prior to where the new node will be inserted
      while (node !== undefined && node.data < value) {
        previousNode = node;
        node = node.next!;
      }
      if (node !== undefined && node.data === value) {
        // do not insert duplicate nodes into a skip list
        return;
      }
      const insertedNode = this.#insertAfter(value, previousNode);
      this.#setupPromotions(insertedNode, descendedNodesByLayer);
      return;
    }
  }

  #insertAfter(
    valueToInsert: T,
    previousNode: SkipListNode<T>,
  ): SkipListNode<T> {
    const previousNext = previousNode.next;
    previousNode.next = new SkipListNode(valueToInsert);
    previousNode.next.next = previousNext;
    return previousNode.next;
  }

  #insertAsHead(value: T) {
    let formerHeadNode = this.head!;
    let newHeadNode = new SkipListNode(value);
    this.head = newHeadNode;
    while (true) {
      // point to existing head column nodes until the original head values are re-inserted
      newHeadNode.next = formerHeadNode;
      if (formerHeadNode.down === undefined) {
        break;
      }
      newHeadNode.down = new SkipListNode(value);
      newHeadNode = newHeadNode.down;
      formerHeadNode = formerHeadNode.down;
    }
    // remove and re-insert the original head value after the new head value
    this.remove(formerHeadNode.data);
    this.#insertAfter(formerHeadNode.data, newHeadNode);
  }

  #setupPromotions(
    insertedNode: SkipListNode<T>,
    descendedNodesByLayer: Array<SkipListNode<T>>,
  ) {
    let previousNode = insertedNode;
    let numPromotions = 0;
    for (let i = descendedNodesByLayer.length - 1; i >= 0; i--) {
      if (
        !this.#probabilityFunction() ||
        numPromotions >= this.#maxPromotions
      ) {
        return;
      }
      // promote by inserting a node in the layer above the current layer
      const leftNeighborNode = descendedNodesByLayer[i];
      const newNode = new SkipListNode<T>(previousNode.data);
      newNode.next = leftNeighborNode.next;
      leftNeighborNode.next = newNode;
      newNode.down = previousNode;
      previousNode = newNode;
      numPromotions += 1;
    }
    if (numPromotions < descendedNodesByLayer.length) {
      return;
    }

    // perform any additional promotions by creating new layers
    while (this.#probabilityFunction() && numPromotions < this.#maxPromotions) {
      // promote both the head and the node in its new layer, promote the head
      // first (the head node must be present in all layers)
      const formerHead = this.head!;
      this.head = new SkipListNode(formerHead.data);
      this.head.down = formerHead;
      // promote by inserting a node in the layer above the current layer
      const newNode = new SkipListNode<T>(previousNode.data);
      this.head.next = newNode;
      newNode.down = previousNode;
      previousNode = newNode;
      numPromotions += 1;
    }
  }

  remove(value: T) {
    if (this.head === undefined) {
      return;
    }
    if (this.head.data === value) {
      const newHeadValue = this.values.at(1);
      if (newHeadValue === undefined) {
        // remove the reference to the head node, which is the only node
        deleteObjectProperties(this.head);
        this.head = undefined;
        return;
      }
      // change the values of the head node column to match the next value in
      // the list, and remove the nodes which originally held that value.
      for (
        let node: SkipListNode<T> | undefined = this.head;
        node !== undefined;
        node = node.down
      ) {
        node.data = newHeadValue;
        const nextNode = node.next;
        if (nextNode !== undefined && nextNode.data === newHeadValue) {
          // remove the node
          node.next = nextNode.next;
          deleteObjectProperties(nextNode);
        }
      }
      return;
    }
    // traverse each layer, removing nodes with the target value
    for (
      let startNode = this.head;
      startNode !== undefined;
      startNode = startNode.down!
    ) {
      for (
        let node = startNode.next, previousNode = startNode;
        node !== undefined;
        previousNode = node, node = node.next!
      ) {
        if (node.data === value) {
          previousNode.next = node.next;
          deleteObjectProperties(node);
          break;
        }
      }
    }
  }

  get values(): ReadonlyArray<T> {
    const array: Array<T> = [];
    if (this.head === undefined) {
      return array;
    }
    let lowestHeadNode: SkipListNode<T> | undefined = this.head;
    while (lowestHeadNode.down !== undefined) {
      lowestHeadNode = lowestHeadNode.down;
    }
    while (lowestHeadNode !== undefined) {
      array.push(lowestHeadNode.data);
      lowestHeadNode = lowestHeadNode.next;
    }
    return array;
  }

  public toString(): string {
    if (this.head === undefined) {
      return "SkipList {}";
    }
    let result = "\n";
    for (
      let startNode = this.head;
      startNode !== undefined;
      startNode = startNode.down!
    ) {
      if (startNode !== this.head) {
        result = `${result}\n`;
      }
      result = `  ${result}{`;
      const rowArray: Array<T> = [];
      for (let node = startNode; node !== undefined; node = node.next!) {
        rowArray.push(node.data);
      }
      result = `${result}${rowArray.join(" -> ")}}`;
    }
    return result;
  }
}
