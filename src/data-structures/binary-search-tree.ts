import { BinaryTreeNode } from "./binary-tree";

export class BinarySearchTree<T> {
  root?: BinaryTreeNode<T>;

  isBalanced(): boolean {
    throw new Error("Not implemented");
  }

  isComplete(): boolean {
    throw new Error("Not implemented");
  }

  isFull(): boolean {
    throw new Error("Not implemented");
  }

  isPerfect(): boolean {
    throw new Error("Not implemented");
  }

  /* Binary search tree traversals implemented in a "composite-like" way
   * - In-Order
   * - Pre-Order
   * - Post-Order
   */

  static inOrderTraversal<T>(
    visit: (node: BinaryTreeNode<T>) => void,
    node?: BinaryTreeNode<T>,
  ) {
    if (node === undefined) {
      return;
    }
    // In-Order: the node's left child, then the node, then the node's right child
    BinarySearchTree.inOrderTraversal(visit, node.left);
    visit(node);
    BinarySearchTree.inOrderTraversal(visit, node.right);
  }

  static preOrderTraversal<T>(
    visit: (node: BinaryTreeNode<T>) => void,
    node?: BinaryTreeNode<T>,
  ) {
    if (node === undefined) {
      return;
    }
    // Pre-Order: the node, then the node's left child, then the node's right child
    visit(node);
    BinarySearchTree.preOrderTraversal(visit, node.left);
    BinarySearchTree.preOrderTraversal(visit, node.right);
  }

  static postOrderTraversal<T>(
    visit: (node: BinaryTreeNode<T>) => void,
    node?: BinaryTreeNode<T>,
  ) {
    if (node === undefined) {
      return;
    }
    // Post-Order: the node's left child, then the node's right child, then the node
    BinarySearchTree.postOrderTraversal(visit, node.left);
    BinarySearchTree.postOrderTraversal(visit, node.right);
    visit(node);
  }
}
