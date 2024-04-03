import { SinglyLinkedList, SinglyLinkedNode } from "./singly-linked-list";

/* Queue: A first-in-first-out (FIFO) collection interface implemented using an array.
 *   - add(item) (aka enqueue): add an item to the end of the queue
 *   - remove() (aka dequeue): remove the first item in the queue and return it
 *   - first (aka peek) getter: return the first item in the queue without removing it
 *   - isEmpty getter: return true iff the queue is empty
 *   - length getter: return the length of (number of elements within) the queue
 */
export interface Queue<ElementType> {
  add(item: ElementType): void;
  remove(): ElementType | undefined;
  get first(): ElementType | undefined;
  get isEmpty(): boolean;
  get length(): number;
}

export class QueueArray<ElementType> implements Queue<ElementType> {
  #array: Array<ElementType> = [];

  constructor(iterable?: Iterable<ElementType>) {
    if (iterable) {
      this.#array = Array.from(iterable);
    }
  }

  add(item: ElementType) {
    this.#array.push(item);
  }
  remove() {
    return this.#array.shift();
  }
  get first() {
    return this.#array.at(0);
  }
  get isEmpty() {
    return this.#array.length === 0;
  }
  get length() {
    return this.#array.length;
  }
}

export class QueueLinkedList<ElementType> implements Queue<ElementType> {
  #list: SinglyLinkedList<ElementType>;
  #last: SinglyLinkedNode<ElementType> | undefined;
  #length: number = 0;

  constructor(iterable?: Iterable<ElementType>) {
    this.#list = new SinglyLinkedList();
    if (iterable) {
      for (const item of iterable) {
        this.add(item);
      }
    }
  }

  add(item: ElementType) {
    this.#length += 1;
    const node = new SinglyLinkedNode(item);
    const previousLast = this.#last;
    this.#last = node;
    if (this.isEmpty) {
      this.#list.insertBeginning(node);
      return;
    }
    this.#list.insertAfter(previousLast!, node);
  }
  remove() {
    this.#length -= 1;
    const value = this.first;
    this.#list.removeBeginning();
    return value;
  }
  get first() {
    return this.#list?.root?.data;
  }
  get isEmpty() {
    return this.#list.root === undefined;
  }
  get length() {
    // A less-efficient implementation would be to return `this.#list.length`, instead
    // of tracking the length via counting in add/remove.
    return this.#length;
  }
}
