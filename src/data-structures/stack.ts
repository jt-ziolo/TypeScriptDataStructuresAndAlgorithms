import { SinglyLinkedList, SinglyLinkedNode } from "./singly-linked-list";

/* Queue: A last-in-first-out (LIFO) collection interface implemented using an array.
 *   - push(item): add an item to the top of the stack
 *   - pop(): remove the bottom item in the stack and return it
 *   - top (aka peek) getter: return the top item in the stack without removing it
 *   - isEmpty getter: return true iff the stack is empty
 *   - length getter: return the length of - or number of elements within - the stack
 */
export interface Stack<ElementType> {
  push(item: ElementType): void;
  pop(): ElementType | undefined;
  get top(): ElementType | undefined;
  get isEmpty(): boolean;
  get length(): number;
}

export class StackArray<ElementType> implements Stack<ElementType> {
  #array: Array<ElementType> = [];

  constructor(iterable?: Iterable<ElementType>) {
    if (iterable) {
      this.#array = Array.from(iterable);
    }
  }

  push(item: ElementType) {
    this.#array.push(item);
  }

  pop() {
    return this.#array.pop();
  }

  get top() {
    return this.#array.at(this.#array.length - 1);
  }

  get isEmpty() {
    return this.#array.length === 0;
  }

  get length() {
    return this.#array.length;
  }
}

export class StackLinkedList<ElementType> implements Stack<ElementType> {
  #list: SinglyLinkedList<ElementType>;
  #length: number = 0;

  constructor(iterable?: Iterable<ElementType>) {
    this.#list = new SinglyLinkedList<ElementType>();
    if (iterable) {
      for (const item of iterable) {
        this.push(item);
      }
    }
  }

  push(item: ElementType) {
    this.#length += 1;
    this.#list.insertBeginning(new SinglyLinkedNode<ElementType>(item));
  }

  pop() {
    const value = this.#list.root?.data;
    this.#list.removeBeginning();
    if (value !== undefined) {
      this.#length -= 1;
    }
    return value;
  }
  get top() {
    return this.#list.root?.data;
  }
  get isEmpty() {
    return this.#list.root === undefined;
  }
  get length() {
    return this.#length;
  }
}
