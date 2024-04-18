import { deleteObjectProperties, isDefinedAndNotNaN, isSorted } from "../util";
import { BinaryTreeNode } from "./binary-tree-node";

export class BinaryTree<T> {
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
      // Stryker disable next-line ArithmeticOperator: mutant does not survive
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
      // Stryker disable next-line all: mutants do not survive
      if (depth > maxDepth) {
        maxDepth = depth;
      }
    }, this.root);
    return count === Math.pow(2, maxDepth + 1) - 1;
  }

  // Stryker disable all: for debugging, not used in tests and not critical
  get [Symbol.toStringTag]() {
    const array: Array<T> = [];
    BinaryTree.inOrderTraversal<T>((node) => {
      array.push(node.data);
    }, this.root);
    return array.toString();
  }
  // Stryker restore all

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
    // Stryker disable all: mutants do not survive
    BinaryTree.depthAwareInOrderTraversal(visit, node.left, depth + 1);
    visit(node, depth);
    BinaryTree.depthAwareInOrderTraversal(visit, node.right, depth + 1);
    // Stryker restore all
  }

  static countNodes<T>(node?: BinaryTreeNode<T>): number {
    if (node === undefined) {
      return 0;
    }
    return 1 + this.countNodes<T>(node.left) + this.countNodes<T>(node.right);
  }
}
export type AVLTreeNodeDataWrapper<T> = { innerData: T; height: number };

export class AVLTree<T> extends BinaryTree<AVLTreeNodeDataWrapper<T>> {
  balance(node: BinaryTreeNode<AVLTreeNodeDataWrapper<T>> | undefined) {
    if (node === undefined) {
      return;
    }
    const balance = AVLTree.getBalance(node);
    if (balance === 0) {
      // higher subtrees are balanced
      return;
    }
    if (balance <= 1 && balance >= -1) {
      // balanced, but subtrees may not be
      this.balance(node.left);
      this.balance(node.right);
      return;
    }

    if (balance > 1) {
      // determine shape
      // Left Right Shape: the left node has a negative balance
      const isLeftRightShape = AVLTree.getBalance(node.left!) < 0;
      // left rotation of Left Right Shape at the left node yields Left Left Shape
      if (isLeftRightShape) {
        AVLTree.rotateLeftAroundNode<T>(node.left!);
      }
      // Left Left Shape: the left node has a positive balance
      // the tree is guaranteed to have this shape at this point
      // right rotation of Left Left Shape at the parent node balances the tree at this node
      // will also update heights prior to further recursive balance calls
      AVLTree.rotateRightAroundNode<T>(node);
    } else {
      // balance < 1
      // determine shape
      // Right Left Shape: the right node has a positive balance
      const isRightLeftShape = AVLTree.getBalance(node.right!) > 0;
      // right rotation of Right Left Shape at the right node yields Right Right Shape
      if (isRightLeftShape) {
        AVLTree.rotateRightAroundNode<T>(node.right!);
      }
      // Right Right Shape: the right node has a positive balance
      // the tree is guaranteed to have this shape at this point
      // left rotation of Right Right Shape at the parent node balances the tree at this node
      // will also update heights prior to further recursive balance calls
      AVLTree.rotateLeftAroundNode<T>(node);
    }

    AVLTree.updateHeights(node);
    this.balance(node.left);
    this.balance(node.right);
  }

  rotateRight() {
    AVLTree.rotateRightAroundNode<T>(this.root);
  }

  rotateLeft() {
    AVLTree.rotateLeftAroundNode<T>(this.root);
  }

  // Stryker disable all: for debugging, not used in tests and not critical
  get [Symbol.toStringTag]() {
    const array: Array<string> = [];
    BinaryTree.preOrderTraversal<AVLTreeNodeDataWrapper<T>>((node) => {
      array.push(`${node.data.innerData}(ht=${node.data.height})`);
    }, this.root);
    return array.toString();
  }
  // Stryker restore all

  static updateHeights<T>(node?: BinaryTreeNode<AVLTreeNodeDataWrapper<T>>) {
    if (node === undefined) {
      return;
    }
    // Post-Order: the node's left child, then the node's right child, then the
    // node. The traversal order ensures that existing heights will not
    // interfere in the calculation of updated heights.
    AVLTree.updateHeights(node.left);
    AVLTree.updateHeights(node.right);
    // each non-leaf node's height is the sum of the heights of the node's
    // children
    node.data.height =
      (node.left?.data.height ?? 0) + (node.right?.data.height ?? 0);
    // leaves have a height of 1
    // Stryker disable next-line ConditionalExpression, LogicalOperator: mutants fail tests
    if (node.left !== undefined && node.right !== undefined) {
      return;
    }
    node.data.height = 1;
  }

  static rotateRightAroundNode<T>(
    node: BinaryTreeNode<AVLTreeNodeDataWrapper<T>>,
  ) {
    // 1. The left node becomes the root
    // 2. The original root becomes the right subtree of the new root
    // 3. The new root's original right subtree becomes the left subtree of the original root

    // The node passed in is linked-to by its parent and so its value must be replaced instead of altering its actual position
    const tempData = node.data;
    const leftNode = node.left!;
    node.data = leftNode.data;
    if (node.right !== undefined) {
      const tempRightData = node.right.data;
      node.right.data = tempData;
      node.right.right = new BinaryTreeNode<AVLTreeNodeDataWrapper<T>>(
        tempRightData,
      );
    } else {
      node.right = new BinaryTreeNode<AVLTreeNodeDataWrapper<T>>(tempData);
    }
    node.right.left = leftNode.right;
    node.left = leftNode.left;
    deleteObjectProperties(leftNode);
  }

  static rotateLeftAroundNode<T>(
    node: BinaryTreeNode<AVLTreeNodeDataWrapper<T>>,
  ) {
    // 1. The right node becomes the root
    // 2. The original root becomes the left subtree of the new root
    // 3. The new root's original left subtree becomes the right subtree of the original root

    // The node passed in is linked-to by its parent and so its value must be replaced instead of altering its actual position
    const tempData = node.data;
    const rightNode = node.right!;
    node.data = rightNode.data;
    if (node.left !== undefined) {
      const tempLeftData = node.left.data;
      node.left.data = tempData;
      node.left.left = new BinaryTreeNode<AVLTreeNodeDataWrapper<T>>(
        tempLeftData,
      );
    } else {
      node.left = new BinaryTreeNode<AVLTreeNodeDataWrapper<T>>(tempData);
    }
    node.left.right = rightNode.left;
    node.right = rightNode.right;
    deleteObjectProperties(rightNode);
  }

  static getBalance<T>(node: BinaryTreeNode<AVLTreeNodeDataWrapper<T>>) {
    return (node.left?.data.height ?? 0) - (node.right?.data.height ?? 0);
  }
}
