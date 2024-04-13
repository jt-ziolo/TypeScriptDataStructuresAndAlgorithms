/* Skip List: A data structure consisting of ordered link lists. Each
 * successive list contains fewer and fewer elements, chosen randomly. During a
 * search operation, lists are traversed from the sparser lists (express lanes)
 * down to the normal lane which contains all elements.
 */

import { MissingIndexError, OutOfBoundsError } from "../error";
import {
  Collection,
  CollectionConstructor,
  CollectionCopyToFunction,
  HasLength,
  IsValidFiniteNumber,
  deleteObjectProperties,
} from "../util";
import { LinkedNode } from "./linked-list";

export type ProbabilityFunction = () => boolean;

export class SkipListNode<T> implements LinkedNode<T> {
  data: T;
  next?: SkipListNode<T>;
  nextLength?: number;
  down?: SkipListNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class SkipList<T> implements HasLength, RelativeIndexable<T> {
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

  at(index: number): T {
    /* Traverse while checking the sum of nextLengths
     * - Case 1: sum(nextLengths) + nextLength === index, return the next
     *   node's value
     * - Case 2: sum(nextLengths) + nextLength > index OR no next node, descend
     * - Case 3: sum(nextLengths) + nextLength < index, add the nextLength to
     *   the sum and move to the next node
     */
    if (index < 0 || this.head === undefined) {
      throw new OutOfBoundsError(index, this.length);
    }
    if (index === 0) {
      return this.head.data;
    }
    let node: SkipListNode<T> = this.head;
    let nextNode: SkipListNode<T> | undefined = node.next;
    let sumNextLengths = 0;
    while (true) {
      const nextSum = sumNextLengths + (node.nextLength ?? 0);
      if (nextSum === index) {
        return nextNode!.data;
      }
      // Stryker disable next-line EqualityOperator: equality is handled by clause above
      if (nextNode === undefined || nextSum > index) {
        if (node.down !== undefined) {
          // descend
          node = node.down;
          nextNode = node.next;
          continue;
        }
        // cannot descend
        // if the next node is undefined, then the index is invalid (out of bounds)
        if (nextNode === undefined) {
          throw new OutOfBoundsError(index, this.length);
        }
        // undefined behavior
        throw new MissingIndexError(index);
      }
      sumNextLengths = nextSum;
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
    const endNodesByLayer: Array<SkipListNode<T>> = [];
    let node: SkipListNode<T> = this.head;
    let nextNode: SkipListNode<T> | undefined = this.head.next;
    const lengthToEndNodesByLayer: Array<number> = [];
    let lengthTraversedCurrentLayer = 0;
    while (true) {
      if (node.data === value) {
        // do not insert duplicate values
        return;
      }
      if (nextNode === undefined || nextNode.data > value) {
        endNodesByLayer.push(node);
        lengthToEndNodesByLayer.push(lengthTraversedCurrentLayer);
        // lengthTraversedCurrentLayer = 0;
        if (node.down !== undefined) {
          // descend from node
          node = node.down;
          nextNode = node.next;
          continue;
        }
        // cannot descend, at insertion point
        const insertedNode = this.#insertAfter(value, node);
        this.#setupPromotions(
          insertedNode,
          endNodesByLayer,
          lengthToEndNodesByLayer,
        );
        return;
      }
      lengthTraversedCurrentLayer += node.nextLength!;
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
    previousNode.next.nextLength = previousNext === undefined ? undefined : 1;
    previousNode.nextLength = 1;
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
    endNodesByLayer: Array<SkipListNode<T>>,
    lengthToEndNodesByLayer: Array<number>,
  ) {
    let previousNode = insertedNode;
    let numPromotions = 0;
    const totalTraversedNextLength =
      lengthToEndNodesByLayer[lengthToEndNodesByLayer.length - 1];
    for (let i = endNodesByLayer.length - 2; i >= 0; i--) {
      // The final element is intentionally skipped
      // Stryker disable all: randomized outcomes
      if (
        !this.#probabilityFunction() ||
        numPromotions >= this.#maxPromotions
      ) {
        // update the nextLength values of the remaining end nodes
        while (i >= 0) {
          const leftEndNode = endNodesByLayer[i];
          if (IsValidFiniteNumber(leftEndNode.nextLength)) {
            leftEndNode.nextLength! += 1;
          }
          i--;
        }
        return;
      }
      // Stryker restore all
      // promote by inserting a node in the layer above the current layer
      const leftEndNode = endNodesByLayer[i];
      const newNode = new SkipListNode<T>(insertedNode.data);
      newNode.next = leftEndNode.next;
      const formerNextLengthLeftEndNode = leftEndNode.nextLength;
      const newNextLengthLeftEndNode =
        totalTraversedNextLength + 1 - lengthToEndNodesByLayer[i];
      const nextLengthNewNode = !IsValidFiniteNumber(
        formerNextLengthLeftEndNode,
      )
        ? undefined
        : formerNextLengthLeftEndNode! + 1 - newNextLengthLeftEndNode;
      newNode.nextLength = nextLengthNewNode;
      leftEndNode.next = newNode;
      leftEndNode.nextLength = newNextLengthLeftEndNode;
      newNode.down = previousNode;
      previousNode = newNode;
      // Stryker disable next-line AssignmentOperator: must track accurately for subsequent check
      numPromotions += 1;
    }
    // Stryker disable next-line ConditionalExpression, BlockStatement: caught by state tests
    if (numPromotions < endNodesByLayer.length - 1) {
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
      this.head.nextLength = totalTraversedNextLength + 1;
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
      // removing the head value
      let newHeadValue: T;
      try {
        newHeadValue = this.at(1);
      } catch {
        // remove the reference to the head node, which is the only node
        deleteObjectProperties(this.head);
        this.head = undefined;
        return;
      }
      // change the values of the head node column to match the next value in
      // the list, and remove the nodes which originally held that value.
      this.#shiftToNewHead(newHeadValue);
      return;
    }
    // ensure that the list contains the value to be removed
    if (!this.contains(value)) {
      return;
    }
    // traverse the list
    let node: SkipListNode<T> = this.head;
    let nextNode: SkipListNode<T> | undefined = node.next;
    while (true) {
      if (nextNode === undefined || nextNode.data > value) {
        // decrement the nextLength of the node being descended from
        // Stryker disable next-line ConditionalExpression: prevents NaN assignment
        if (IsValidFiniteNumber(node.nextLength)) {
          node.nextLength! -= 1;
        }
        // descend
        node = node.down!;
        nextNode = node.next;
        continue;
      }
      if (nextNode.data === value) {
        // remove the node while updating the nextLength of the left end node
        this.#removeNextNode(node, nextNode);
        if (node.down !== undefined) {
          // descend
          node = node.down!;
          nextNode = node.next;
          continue;
        }
        return; // finished
      }
      node = nextNode;
      nextNode = node.next;
    }
  }

  #shiftToNewHead(newHeadValue: T) {
    for (
      let node: SkipListNode<T> | undefined = this.head;
      node !== undefined;
      node = node.down
    ) {
      node.data = newHeadValue;
      const nextNode = node.next;
      node.nextLength = !IsValidFiniteNumber(node.nextLength)
        ? undefined
        : node.nextLength! - 1;
      // Stryker disable next-line OptionalChaining: caught as TypeError
      // Stryker disable next-line ConditionalExpression: optimization
      if (nextNode?.data === newHeadValue) {
        // remove the next node since it will be a duplicate of the new head
        // node
        this.#removeNextNode(node, nextNode);
        // undo the decrementing of node.nextLength, since we are removing a
        // duplicate node
        node.nextLength! += 1;
      }
    }
  }

  #removeNextNode(node: SkipListNode<T>, nextNode: SkipListNode<T>) {
    node.next = nextNode.next;
    // Stryker disable next-line ConditionalExpression: prevents NaN assignment
    if (!IsValidFiniteNumber(nextNode.nextLength)) {
      node.nextLength = undefined;
    } else {
      node.nextLength! += nextNode.nextLength! - 1;
    }
    deleteObjectProperties(nextNode);
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
      const rowArray: Array<string> = [];
      for (let node = startNode; node !== undefined; node = node.next!) {
        rowArray.push(`${node.data}(${node.nextLength ?? "inf"})`);
      }
      result = `${result}${rowArray.join(" -> ")}}`;
    }
    return result;
  }
  // Stryker restore all
}
