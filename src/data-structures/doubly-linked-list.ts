import { deleteObjectProperties } from "../util";
import { LinkedList, LinkedNode } from "./linked-list";

export class DoublyLinkedNode<T> implements LinkedNode<T> {
  data: T;
  previous?: DoublyLinkedNode<T> | DoublyLinkedRootNode<T>;
  next?: DoublyLinkedNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedRootNode<T> implements LinkedNode<T> {
  data: T;
  next?: DoublyLinkedNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedList<T> implements LinkedList<T> {
  #root?: DoublyLinkedRootNode<T>;

  constructor(root?: DoublyLinkedRootNode<T>) {
    this.#root = root;
  }

  insertBeginning(newRoot: DoublyLinkedRootNode<T>) {
    if (this.#root !== undefined) {
      const oldRoot = new DoublyLinkedNode<T>(this.#root.data);
      oldRoot.previous = newRoot;
      newRoot.next = oldRoot;
    }
    this.#root = newRoot;
  }

  insertAfter(node: DoublyLinkedNode<T>, newNode: DoublyLinkedNode<T>) {
    newNode.next = node.next;
    if (newNode.next !== undefined) {
      newNode.next.previous = newNode;
    }
    node.next = newNode;
    newNode.previous = node;
  }

  removeBeginning() {
    const newRoot = this.#root?.next;
    deleteObjectProperties(this.#root);
    this.#root = newRoot;
  }

  removeAfter(node: DoublyLinkedNode<T>) {
    if (node.next === undefined) {
      return;
    }
    const newNextNode = node.next.next;
    deleteObjectProperties(node.next);
    node.next = newNextNode;
    if (newNextNode !== undefined) {
      newNextNode.previous = node;
    }
  }

  get root() {
    return this.#root;
  }

  get length() {
    let count = 0;
    let current = this.root;
    while (current !== undefined) {
      count += 1;
      current = current.next;
    }
    return count;
  }

  [Symbol.iterator](): Iterator<DoublyLinkedNode<T>> {
    let current = this.root;
    return {
      next() {
        if (current === undefined) {
          return { value: undefined, done: true };
        }
        const result = { value: current, done: false };
        current = current.next;
        return result;
      },
    };
  }
}
