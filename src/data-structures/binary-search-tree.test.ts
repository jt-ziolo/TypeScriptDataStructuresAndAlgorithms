import { BinarySearchTree } from "./binary-search-tree";
import { BinaryTreeNode } from "./binary-tree";

const createSingleNodeTree = (value: number) => {
  const root = new BinaryTreeNode<number>(value);
  return new BinarySearchTree(root);
};

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

  return new BinarySearchTree(root);
};

const createInvalidSmallTree = () => {
  /*
   * 8
   * L=4            R=10
   * L=2    R=12    L=undef.  R=20
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(2);
  next.right = new BinaryTreeNode<number>(12);

  next = root.right!;
  next.right = new BinaryTreeNode<number>(20);

  return new BinarySearchTree(root);
};

const createSmallPerfectTreeWithDuplicates = () => {
  /*
   * 8
   * L=4            R=10
   * L=4    R=6     L=10  R=20
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(6);

  next = root.right!;
  next.left = new BinaryTreeNode<number>(10);
  next.right = new BinaryTreeNode<number>(20);

  return new BinarySearchTree(root);
};

type TraversalCaseSet = (BinarySearchTree<number> | number[])[][];

const cases = {
  traversal: {
    // [tree, result array]
    inOrder: [
      [createSingleNodeTree(123), [123]],
      [createSmallTree(), [2, 4, 6, 8, 10, 20]],
    ],
    preOrder: [
      [createSingleNodeTree(123), [123]],
      [createSmallTree(), [8, 4, 2, 6, 10, 20]],
    ],
    postOrder: [
      [createSingleNodeTree(123), [123]],
      [createSmallTree(), [2, 6, 4, 20, 10, 8]],
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
    (tree, expectedArray) => {
      testArray = [];
      traversalFunction(
        (node) => {
          testArray.push(node.data);
        },
        (tree as BinarySearchTree<number>).root,
      );
      expect(testArray).toStrictEqual(expectedArray);
    },
  );

describe("traversal", () => {
  describe("in-order traversal", () => {
    traversalCase(
      cases.traversal.inOrder,
      "in-order",
      BinarySearchTree.inOrderTraversal<number>,
    );
  });
  describe("pre-order traversal", () => {
    traversalCase(
      cases.traversal.preOrder,
      "pre-order",
      BinarySearchTree.preOrderTraversal<number>,
    );
  });
  describe("post-order traversal", () => {
    traversalCase(
      cases.traversal.postOrder,
      "post-order",
      BinarySearchTree.postOrderTraversal<number>,
    );
  });
});

describe("tree qualities", () => {
  describe("isValidBinarySearchTree", () => {
    const valid = createSmallTree();
    const invalid = createInvalidSmallTree();
    expect(valid.isValidBinarySearchTree()).toBe(true);
    expect(invalid.isValidBinarySearchTree()).toBe(false);
  });
  describe("lacksDuplicates", () => {
    const noDuplicates = createSmallTree();
    const hasDuplicates = createSmallPerfectTreeWithDuplicates();
    expect(noDuplicates.lacksDuplicates()).toBe(true);
    expect(hasDuplicates.lacksDuplicates()).toBe(false);
  });
  describe.skip("isBalanced", () => {});
  describe.skip("isComplete", () => {});
  describe.skip("isFull", () => {});
  describe.skip("isPerfect", () => {});
});
