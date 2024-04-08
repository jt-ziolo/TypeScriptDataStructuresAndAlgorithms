import { HasLength } from "../util";

export interface LinkedNode<T> {
  data: T;
  next?: LinkedNode<T>;
}

export interface LinkedList<T> extends HasLength, Iterable<LinkedNode<T>> {
  get root(): LinkedNode<T> | undefined;

  insertBeginning(newRoot: LinkedNode<T>): void;
  insertAfter(node: LinkedNode<T>, newNode: LinkedNode<T>): void;
  removeBeginning(): void;
  removeAfter(node: LinkedNode<T>): void;
}
