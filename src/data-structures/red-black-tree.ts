import { isDefinedAndNotNaN, isSorted } from "../util";
import { BinaryTree } from "./binary-tree";
import { BinaryTreeNode } from "./binary-tree-node";

export type RedBlackTreeNodeDataWrapper<T> = {
  innerData: T;
  isRed: boolean;
  nBlackOrUndefinedChildrenPerPath?: number;
};

/* Red-Black Tree, a self-balancing binary tree. Has the properties:
 * 1. Every node is either red or black
 * 2. The root is black
 * 3. Every leaf is a NULL node, and every leaf is black.
 * 4. Every red node must have exactly two black child nodes.
 * 5. Every path from a node to its leaves must have the same number of black
 * child nodes.
 *
 * Instead of creating null nodes, I am opting to leave the value of unoccupied
 * left and right nodes as undefined and will account for those undefined leafs
 * in the balancing methods.
 */
export class RedBlackTree<T> extends BinaryTree<
  RedBlackTreeNodeDataWrapper<T>
> {
  isValidBinarySearchTree(): boolean {
    // TODO: figure out a nice way to handle reuse with TypeScript
    const array = new Array<T>();
    let allDefined = true;
    BinaryTree.inOrderTraversal<RedBlackTreeNodeDataWrapper<T>>((node) => {
      if (!isDefinedAndNotNaN(node.data.innerData)) {
        allDefined = false;
        return;
      }
      array.push(node.data.innerData);
    }, this.root);

    if (!allDefined) {
      return false;
    }

    return isSorted(array);
  }

  isValidRedBlackTree(): boolean {
    if (!this.isValidBinarySearchTree()) {
      return false;
    }
    // Check properties #2, 4, and 5
    // The root must be black
    if (this.root.data.isRed) {
      return false;
    }
    // Every red node must have two black child nodes
    let propertyHolds = true;
    RedBlackTree.inOrderTraversal((node) => {
      if (!node.data.isRed || !propertyHolds) {
        return;
      }
      propertyHolds = RedBlackTree.nBlackOrUndefinedChildren(node) === 2;
    }, this.root);
    if (!propertyHolds) {
      return false;
    }
    // Every path from a node to its leaves must have the same number of black child nodes.
    // Use a post-order traversal to visit all leaves first, and track that
    // n(left,total) === n(right,total) all the way up the tree.
    // No need to reset the nBlackOrUndefinedChildrenPerPath property, since
    // the leaf nodes are undefined and it will be overwritten on the way up
    // the tree.
    RedBlackTree.postOrderTraversal((node) => {
      if (!propertyHolds) {
        return;
      }
      let nLeft = node.left?.data.nBlackOrUndefinedChildrenPerPath ?? 1;
      nLeft += node.left?.data.isRed ? 0 : 1;
      let nRight = node.right?.data.nBlackOrUndefinedChildrenPerPath ?? 1;
      nRight += node.right?.data.isRed ? 0 : 1;
      if (nLeft !== nRight) {
        propertyHolds = false;
      }
      node.data.nBlackOrUndefinedChildrenPerPath = nLeft;
    }, this.root);
    if (!propertyHolds) {
      return false;
    }

    return true;
  }

  insert(value: T) {
    // insert at the appropriate leaf; use post-order traversal
    throw new Error("Not implemented");
  }

  static nBlackOrUndefinedChildren<T>(
    node: BinaryTreeNode<RedBlackTreeNodeDataWrapper<T>> | undefined,
  ) {
    if (node === undefined) {
      return 0;
    }
    let count = 0;
    if (node.left === undefined || !node.left.data.isRed) {
      count++;
    }
    if (node.right === undefined || !node.right.data.isRed) {
      count++;
    }
    return count;
  }
}
