import { isSorted } from "../util";
import { BinaryTreeNode } from "./binary-tree";
import { QueueArray } from "./queue";

const isDefinedAndNotNaN = (value: unknown) => {
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
      if (!isDefinedAndNotNaN(node.data)) {
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

  isComplete(): boolean {
    return this.#isCompleteInternal(
      this.root,
      0,
      BinarySearchTree.countNodes<T>(this.root),
    );
  }

  #isCompleteInternal(
    node: BinaryTreeNode<T> | undefined,
    index: number,
    totalNodes: number,
  ): boolean {
    if (node === undefined) {
      // base case: an empty tree is complete
      return true;
    }

    if (index >= totalNodes) {
      // a property of a complete tree is that when all nodes have indices
      // assigned using 2n+1 (left) and 2n+2 (right), each node's index will be
      // less than the total number of nodes in the tree
      return false;
    }

    return (
      this.#isCompleteInternal(node.left, 2 * index + 1, totalNodes) &&
      this.#isCompleteInternal(node.right, 2 * index + 2, totalNodes)
    );
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

  static depthAwareInOrderTraversal<T>(
    visit: (node: BinaryTreeNode<T>, depth: number) => void,
    node?: BinaryTreeNode<T>,
    depth: number = 0,
  ) {
    if (node === undefined) {
      return;
    }
    // In-Order: the node's left child, then the node, then the node's right child
    BinarySearchTree.depthAwareInOrderTraversal(visit, node.left, depth + 1);
    visit(node, depth);
    BinarySearchTree.depthAwareInOrderTraversal(visit, node.right, depth + 1);
  }

  static countNodes<T>(node?: BinaryTreeNode<T>): number {
    if (node === undefined) {
      return 0;
    }
    return 1 + this.countNodes<T>(node.left) + this.countNodes<T>(node.right);
  }
}
