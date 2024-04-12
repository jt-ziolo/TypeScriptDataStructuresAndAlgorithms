/* Binary search tree traversals implemented in a "composite-like" way
 * - In-Order
 * - Pre-Order
 * - Post-Order
 */

import { BinaryTreeNode } from "../data-structures/binary-tree";

export function inOrderTraversal<T>(
  visit: (node: BinaryTreeNode<T>) => void,
  node?: BinaryTreeNode<T>,
) {
  if (node === undefined) {
    return;
  }
  // In-Order: the node's left child, then the node, then the node's right child
  inOrderTraversal(visit, node.left);
  visit(node);
  inOrderTraversal(visit, node.right);
}
