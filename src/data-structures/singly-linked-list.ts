import { LinkedList } from "./linked-list";
import { SinglyLinkedNode } from "./linked-node";

export class SinglyLinkedList<T> implements LinkedList<T> {
  root?: SinglyLinkedNode<T>;

  constructor(root?: SinglyLinkedNode<T>) {
    this.root = root;
  }

  insertBeginning(newRoot: SinglyLinkedNode<T>) {
    newRoot.next = this.root;
    this.root = newRoot;
  }

  removeBeginning() {
    const newRoot = this.root?.next;
    if (newRoot === undefined) {
      delete this.root;
      return;
    }
    this.root = newRoot;
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

  insertAfter(node: SinglyLinkedNode<T>, newNode: SinglyLinkedNode<T>) {
    newNode.next = node.next;
    node.next = newNode;
  }

  removeAfter(node: SinglyLinkedNode<T>) {
    if (node.next === undefined) {
      return;
    }
    const newNextNode = node.next?.next;
    delete node.next;
    node.next = newNextNode;
  }
}
