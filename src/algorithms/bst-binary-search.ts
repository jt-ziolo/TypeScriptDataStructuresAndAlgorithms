import { BinaryTreeNode } from "../data-structures/binary-tree-node";

/* BST Binary Search
 */
export function binarySearch<T>(
  startNode: BinaryTreeNode<T> | undefined,
  searchValue: T,
): BinaryTreeNode<T> | null {
  if (startNode === undefined) {
    return null;
  }
  if (startNode.data === searchValue) {
    return startNode;
  } else if (startNode.data < searchValue) {
    return binarySearch(startNode.right, searchValue);
  } else {
    // startNode.data > searchValue
    return binarySearch(startNode.left, searchValue);
  }
}
