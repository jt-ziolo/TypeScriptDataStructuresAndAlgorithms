import { deleteObjectProperties } from "../util";
import { LinkedList } from "./linked-list";
import { SinglyLinkedNode } from "./linked-node";

export class SinglyLinkedList<T> implements LinkedList<T> {
  #root?: SinglyLinkedNode<T>;

  constructor(root?: SinglyLinkedNode<T>) {
    this.#root = root;
  }

  insertBeginning(newRoot: SinglyLinkedNode<T>) {
    newRoot.next = this.#root;
    this.#root = newRoot;
  }

  insertAfter(node: SinglyLinkedNode<T>, newNode: SinglyLinkedNode<T>) {
    newNode.next = node.next;
    node.next = newNode;
  }

  removeBeginning() {
    const newRoot = this.#root?.next;
    if (newRoot === undefined) {
      deleteObjectProperties(this.#root);
      this.#root = undefined;
      return;
    }
    this.#root = newRoot;
  }

  removeAfter(node: SinglyLinkedNode<T>) {
    const newNextNode = node.next?.next;
    deleteObjectProperties(node.next);
    node.next = newNextNode;
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

  [Symbol.iterator](): Iterator<SinglyLinkedNode<T>> {
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
