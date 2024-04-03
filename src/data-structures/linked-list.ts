export interface LinkedNode<T> {
  data: T;
  next?: LinkedNode<T>;
}

export interface LinkedList<T> {
  get root(): LinkedNode<T> | undefined;

  insertBeginning(newRoot: LinkedNode<T>): void;
  insertAfter(node: LinkedNode<T>, newNode: LinkedNode<T>): void;
  removeBeginning(): void;
  removeAfter(node: LinkedNode<T>): void;

  get length(): number;

  [Symbol.iterator](): Iterator<LinkedNode<T>>;
}
