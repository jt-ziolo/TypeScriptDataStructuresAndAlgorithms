export class BinaryTreeNode<T> {
  data: T;
  left?: BinaryTreeNode<T>;
  right?: BinaryTreeNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}
