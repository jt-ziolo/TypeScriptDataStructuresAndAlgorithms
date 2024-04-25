import { deleteObjectProperties } from "../util";
import { BinaryTreeNode } from "./binary-tree-node";
import { BinaryTree } from "./binary-tree";

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
