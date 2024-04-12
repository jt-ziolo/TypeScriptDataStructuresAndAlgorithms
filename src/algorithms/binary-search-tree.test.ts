import { BinaryTreeNode } from "../data-structures/binary-tree";
import {
  inOrderTraversal,
  postOrderTraversal,
  preOrderTraversal,
} from "./binary-search-tree";

const createSmallTree = () => {
  /*
   * 8
   * L=4            R=10
   * L=2    R=6     L=undef.  R=20
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(2);
  next.right = new BinaryTreeNode<number>(6);

  next = root.right!;
  next.right = new BinaryTreeNode<number>(20);

  return root;
};

type TraversalCaseSet = (number | BinaryTreeNode<number> | number[])[][];

const cases = {
  traversal: {
    inOrder: [
      [new BinaryTreeNode<number>(123), 1, [123]],
      [createSmallTree(), 6, [2, 4, 6, 8, 10, 20]],
    ],
    preOrder: [
      [new BinaryTreeNode<number>(123), 1, [123]],
      [createSmallTree(), 6, [8, 4, 2, 6, 10, 20]],
    ],
    postOrder: [
      [new BinaryTreeNode<number>(123), 1, [123]],
      [createSmallTree(), 6, [2, 6, 4, 20, 10, 8]],
    ],
  },
};

let testArray: Array<number> = [];

const traversalCase = (
  caseSet: TraversalCaseSet,
  traversalKind: string,
  traversalFunction: (
    visit: (node: BinaryTreeNode<number>) => void,
    root: BinaryTreeNode<number>,
  ) => void,
) =>
  it.each(caseSet)(
    `given binary tree %p, visits nodes ${traversalKind} and constructs array with length %p and value %p`,
    (root, expectedLength, expectedArray) => {
      testArray = [];
      traversalFunction((node) => {
        testArray.push(node.data);
      }, root as BinaryTreeNode<number>);
      expect(testArray.length).toBe(expectedLength);
      expect(testArray).toStrictEqual(expectedArray);
    },
  );

describe("traversal", () => {
  describe("in-order traversal", () => {
    traversalCase(cases.traversal.inOrder, "in-order", inOrderTraversal);
  });
  describe("pre-order traversal", () => {
    traversalCase(cases.traversal.preOrder, "pre-order", preOrderTraversal);
  });
  describe("post-order traversal", () => {
    traversalCase(cases.traversal.postOrder, "post-order", postOrderTraversal);
  });
});
