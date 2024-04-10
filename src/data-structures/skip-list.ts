/* Skip List: A data structure consisting of ordered link lists. Each
 * successive list contains fewer and fewer elements, chosen randomly. During a
 * search operation, lists are traversed from the sparser lists (express lanes)
 * down to the normal lane which contains all elements.
 */

import {
  Collection,
  CollectionConstructor,
  CollectionCopyToFunction,
  HasLength,
  deleteObjectProperties,
} from "../util";
import { LinkedNode } from "./linked-list";

export type ProbabilityFunction = () => boolean;

export class SkipListNode<T> implements LinkedNode<T> {
  data: T;
  next?: SkipListNode<T>;
  down?: SkipListNode<T>;

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

  contains(value: T) {
    if (this.head === undefined) {
      return false;
    }
    let node: SkipListNode<T> = this.head;
    let nextNode: SkipListNode<T> | undefined = node.next;
    while (true) {
      if (node.data === value) {
        return true;
      }
      if (nextNode === undefined || nextNode.data > value) {
        if (node.down !== undefined) {
          // descend
          node = node.down;
          nextNode = node.next;
          continue;
        }
        // cannot descend and the next node is either undefined or greater than
        // the target value, so the target value is not in the skip list
        return false;
      }
      node = nextNode;
      nextNode = node.next;
    }
  }

  insert(value: T) {
    if (this.head === undefined) {
      this.head = new SkipListNode<T>(value);
      return;
    }
    // Stryker disable next-line ConditionalExpression, BlockStatement: optimization
    if (this.head.data === value) {
      // do not insert duplicate nodes
      return;
    }
    // Stryker disable next-line EqualityOperator: equality is handled by clause above
    if (this.head.data > value) {
      this.#insertAsHead(value);
      return;
    }

    // traverse the list, tracking the nodes that we descend from as we go
    const descendedNodesByLayer: Array<SkipListNode<T>> = [];
    let node: SkipListNode<T> = this.head;
    let nextNode: SkipListNode<T> | undefined = this.head.next;
    while (true) {
      if (node.data === value) {
        // do not insert duplicate values
        return;
      }
      if (nextNode === undefined || nextNode.data > value) {
        if (node.down !== undefined) {
          // descend from node
          descendedNodesByLayer.push(node);
          node = node.down;
          nextNode = node.next;
          continue;
        }
        // at insertion point
        const insertedNode = this.#insertAfter(value, node);
        this.#setupPromotions(insertedNode, descendedNodesByLayer);
        return;
      }
      node = nextNode;
      nextNode = node.next;
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
    // change the values of the head node column to match the new head value,
    // then insert the former head value
    const formerHeadValue = this.head!.data;
    for (
      let node: SkipListNode<T> | undefined = this.head;
      node !== undefined;
      node = node.down
    ) {
      node.data = value;
    }
    this.insert(formerHeadValue);
  }

  #setupPromotions(
    insertedNode: SkipListNode<T>,
    descendedNodesByLayer: Array<SkipListNode<T>>,
  ) {
    let previousNode = insertedNode;
    let numPromotions = 0;
    for (let i = descendedNodesByLayer.length - 1; i >= 0; i--) {
      // Stryker disable all: randomized outcomes
      if (
        !this.#probabilityFunction() ||
        numPromotions >= this.#maxPromotions
      ) {
        return;
      }
      // Stryker restore all
      // promote by inserting a node in the layer above the current layer
      const leftNeighborNode = descendedNodesByLayer[i];
      const newNode = new SkipListNode<T>(previousNode.data);
      newNode.next = leftNeighborNode.next;
      leftNeighborNode.next = newNode;
      newNode.down = previousNode;
      previousNode = newNode;
      // Stryker disable next-line AssignmentOperator: must track accurately for subsequent check
      numPromotions += 1;
    }
    // Stryker disable next-line ConditionalExpression, BlockStatement: caught by state tests
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
        // Stryker disable next-line OptionalChaining: caught as TypeError
        node.next = nextNode?.next;
        deleteObjectProperties(nextNode);
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

  // Stryker disable all: toString overload used for testing
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
  // Stryker restore all
}
