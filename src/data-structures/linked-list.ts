import { LinkedNode } from "./linked-node";

export interface LinkedList<T> {
  root?: LinkedNode<T>;

  insertBeginning(newRoot: LinkedNode<T>): void;
  removeBeginning(): void;

  get length(): number;

  [Symbol.iterator](): Iterator<LinkedNode<T>>;

  insertAfter(node: LinkedNode<T>, newNode: LinkedNode<T>): void;
  removeAfter(node: LinkedNode<T>): void;
}
