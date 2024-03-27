export class Node<T> {
  data: T;
  child?: Node<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class List<T> {
  root?: Node<T>;

  constructor(root?: Node<T>) {
    this.root = root;
  }

  insertBeginning(newRoot: Node<T>) {
    newRoot.child = this.root;
    this.root = newRoot;
  }

  get length() {
    let count = 0;
    let current = this.root;
    while (current !== undefined) {
      count += 1;
      current = current.child;
    }
    return count;
  }

  [Symbol.iterator]() {
    let current = this.root;
    return {
      next() {
        if (current === undefined) {
          return { value: undefined, done: true };
        }
        const result = { value: current, done: false };
        current = current.child;
        return result;
      },
    };
  }

  // Made this method static since it doesn't rely upon the 
  // instance's state and is more of a utility function
  static insertAfter<E>(node: Node<E>, newNode: Node<E>) {
    newNode.child = node.child;
    node.child = newNode;
  }
}
