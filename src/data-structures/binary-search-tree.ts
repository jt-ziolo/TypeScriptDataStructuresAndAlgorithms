import { isDefinedAndNotNaN, isSorted } from "../util";
import { BinaryTreeNode } from "./binary-tree";

export class BinaryTree<T> {
  root: BinaryTreeNode<T>;

  constructor(root: BinaryTreeNode<T>) {
    this.root = root;
  }

  hasDuplicates(): boolean {
    // Will maintain a reference to the previous node value during an in-order
    // traversal and check that no two neighboring items are the same
    let previousNodeValue: T | null = null;
    let allUnique = true;
    BinaryTree.inOrderTraversal<T>((node) => {
      if (node.data === previousNodeValue) {
        allUnique = false;
        return;
      }
      previousNodeValue = node.data;
    }, this.root);

    if (!allUnique) {
      return true;
    }

    return false;
  }

  isComplete(): boolean {
    return this.#isCompleteInternal(
      this.root,
      0,
      BinaryTree.countNodes<T>(this.root),
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
    // in a full binary tree, all nodes have either zero or two children
    return this.#isFullInternal(this.root);
  }

  #isFullInternal(node?: BinaryTreeNode<T>): boolean {
    // perform an in-order traversal, returning false if any node has only one child
    if (node === undefined) {
      return true;
    }
    if (
      (node.left !== undefined && node.right === undefined) ||
      (node.right !== undefined && node.left === undefined)
    ) {
      return false;
    }
    return this.#isFullInternal(node.left) && this.#isFullInternal(node.right);
  }

  isPerfect(): boolean {
    const count = BinaryTree.countNodes<T>(this.root);
    let maxDepth = 0;
    BinaryTree.depthAwareInOrderTraversal((_, depth) => {
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }, this.root);
    return count === Math.pow(2, maxDepth + 1) - 1;
  }

  public toString(): string {
    const array: Array<T> = [];
    BinaryTree.inOrderTraversal<T>((node) => {
      array.push(node.data);
    }, this.root);
    return array.toString();
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
    BinaryTree.inOrderTraversal(visit, node.left);
    visit(node);
    BinaryTree.inOrderTraversal(visit, node.right);
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
    BinaryTree.preOrderTraversal(visit, node.left);
    BinaryTree.preOrderTraversal(visit, node.right);
  }

  static postOrderTraversal<T>(
    visit: (node: BinaryTreeNode<T>) => void,
    node?: BinaryTreeNode<T>,
  ) {
    if (node === undefined) {
      return;
    }
    // Post-Order: the node's left child, then the node's right child, then the node
    BinaryTree.postOrderTraversal(visit, node.left);
    BinaryTree.postOrderTraversal(visit, node.right);
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
    BinaryTree.depthAwareInOrderTraversal(visit, node.left, depth + 1);
    visit(node, depth);
    BinaryTree.depthAwareInOrderTraversal(visit, node.right, depth + 1);
  }

  static countNodes<T>(node?: BinaryTreeNode<T>): number {
    if (node === undefined) {
      return 0;
    }
    return 1 + this.countNodes<T>(node.left) + this.countNodes<T>(node.right);
  }
}

export class BinarySearchTree<T> extends BinaryTree<T> {
  isValidBinarySearchTree(): boolean {
    // For each node n, (values of left descendants) <= (node value) < (values
    // of right descendants) with the additional restriction that values cannot
    // be undefined and numbers cannot be NaN (but -Infinity and Infinity are
    // allowed).

    // Will build an array from an in-order traversal and check that items are
    // in increasing order, allowing duplicates
    const array = new Array<T>();
    let allDefined = true;
    BinaryTree.inOrderTraversal<T>((node) => {
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
}
