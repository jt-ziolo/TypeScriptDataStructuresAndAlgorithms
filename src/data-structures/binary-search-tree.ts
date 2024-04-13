import { isSorted } from "../util";
import { BinaryTreeNode } from "./binary-tree";
import { QueueArray } from "./queue";

const isDefinedNumber = (value: unknown) => {
  if (
    value === undefined ||
    (typeof value === "number" && isNaN(Number(value)))
  ) {
    return false;
  }
  return true;
};

export class BinarySearchTree<T> {
  root: BinaryTreeNode<T>;

  constructor(root: BinaryTreeNode<T>) {
    this.root = root;
  }

  isValidBinarySearchTree(): boolean {
    // For each node n, (values of left descendants) <= (node value) < (values
    // of right descendants) with the additional restriction that values cannot
    // be undefined and numbers cannot be NaN (but -Infinity and Infinity are
    // allowed).

    // Will build an array from an in-order traversal and check that items are
    // in increasing order, allowing duplicates
    const array = new Array<T>();
    let allDefined = true;
    BinarySearchTree.inOrderTraversal<T>((node) => {
      if (!isDefinedNumber(node.data)) {
        allDefined = false;
        return;
      }
      array.push(node.data);
    }, this.root);

    if (!allDefined) {
      return false;
    }

    return isSorted(array);
  }

  lacksDuplicates(): boolean {
    // Will maintain a reference to the previous node value during an in-order
    // traversal and check that no two neighboring items are the same
    let previousNodeValue: T | null = null;
    let allUnique = true;
    BinarySearchTree.inOrderTraversal<T>((node) => {
      if (node.data === previousNodeValue) {
        allUnique = false;
        return;
      }
      previousNodeValue = node.data;
    }, this.root);

    if (!allUnique) {
      return false;
    }

    return true;
  }

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

  /* Binary search tree traversals implemented recursively
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
