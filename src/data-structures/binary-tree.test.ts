import { BinaryTree } from "./binary-tree";
import { BinaryTreeNode } from "./binary-tree-node";

const createSingleNodeTree = (value: number) => {
  const root = new BinaryTreeNode<number>(value);
  return new BinaryTree(root);
};

const createTree = () => {
  /* Not complete, not full, not perfect
   *               ____________( 8 )____________
   *              /                             \
   *       ____( 4 )____                       (10)____
   *      /             \                              \
   *   ( 2 )           ( 6 )                          (20)
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

  return new BinaryTree(root);
};

const createTreeDuplicates = () => {
  /* Not complete, not full, not perfect, has duplicates
   *               ____________( 8 )____________
   *              /                             \
   *       ____( 4 )____                       (10)____
   *      /             \                              \
   *   ( 4 )           ( 6 )                          (20)
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(6);

  next = root.right!;
  next.right = new BinaryTreeNode<number>(20);

  return new BinaryTree(root);
};

const createTreeInvalid = () => {
  /* Not valid
   *               ____________( 8 )____________
   *              /                             \
   *       ____( 4 )____                       (10)____
   *      /             \                              \
   *   ( 2 )           ( 12 )                          (20)
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

  return new BinaryTree(root);
};

const createTreePerfect = () => {
  /* Complete, full, perfect
   *               ____________( 8 )____________
   *              /                             \
   *       ____( 4 )____                   ____(10)____
   *      /             \                 /            \
   *   ( 2 )           ( 6 )           ( 9 )          (20)
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(2);
  next.right = new BinaryTreeNode<number>(6);

  next = root.right!;
  next.left = new BinaryTreeNode<number>(9);
  next.right = new BinaryTreeNode<number>(20);

  return new BinaryTree(root);
};

const createTreeCompleteOnly = () => {
  /* Complete only
   *               ____________( 8 )____________
   *              /                             \
   *       ____( 4 )____                   ____(10)
   *      /             \                 /
   *   ( 2 )           ( 6 )           ( 9 )
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(2);
  next.right = new BinaryTreeNode<number>(6);

  next = root.right!;
  next.left = new BinaryTreeNode<number>(9);

  return new BinaryTree(root);
};

const createTreeNotCompleteMutantCheck = () => {
  /* Not complete, checks edge case of completeness algorithm
   *                      ____________( 8 )____________
   *                     /                             \
   *              ____( 4 )____                   ____(10)
   *             /             \                 /
   *      ____( 2 )           ( 6 )           ( 9 )
   *     /
   *  ( 1 )
   *
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(2);
  next.right = new BinaryTreeNode<number>(6);

  next = next.left;
  next.left = new BinaryTreeNode<number>(1);

  next = root.right!;
  next.left = new BinaryTreeNode<number>(9);

  return new BinaryTree(root);
};

const createTreeFullOnly = () => {
  /* Full only
   *        ____________( 8 )____________
   *       /                             \
   *    ( 4 )                       ____(10)_____
   *                               /             \
   *                            ( 9 )           (20)
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = root.right!;
  next.left = new BinaryTreeNode<number>(9);
  next.right = new BinaryTreeNode<number>(20);

  return new BinaryTree(root);
};

const createTreeCompleteAndFull = () => {
  /* Complete, full, but not perfect
   *               ____________( 8 )____________
   *              /                             \
   *       ____( 4 )____                       (10)
   *      /             \
   *   ( 2 )           ( 6 )
   */
  const root = new BinaryTreeNode<number>(8);

  let next = root;
  next.left = new BinaryTreeNode<number>(4);
  next.right = new BinaryTreeNode<number>(10);

  next = next.left;
  next.left = new BinaryTreeNode<number>(2);
  next.right = new BinaryTreeNode<number>(6);

  return new BinaryTree(root);
};

type TraversalCaseSet = (BinaryTree<number> | number[])[][];
type CheckCaseSet = BinaryTree<number>[];

const cases = {
  traversal: {
    // [tree, result array]
    inOrder: [
      [createSingleNodeTree(123), [123]],
      [createTree(), [2, 4, 6, 8, 10, 20]],
    ],
    preOrder: [
      [createSingleNodeTree(123), [123]],
      [createTree(), [8, 4, 2, 6, 10, 20]],
    ],
    postOrder: [
      [createSingleNodeTree(123), [123]],
      [createTree(), [2, 6, 4, 20, 10, 8]],
    ],
  },
  checks: {
    // [[trees matching check], [trees not matching check]]
    isValid: [
      createSingleNodeTree(123),
      createTreeCompleteAndFull(),
      createTreeCompleteOnly(),
      createTreeDuplicates(),
      createTreeFullOnly(),
      createTreePerfect(),
      createTree(),
    ],
    isNotValid: [createTreeInvalid(), createSingleNodeTree(NaN)],
    hasDuplicates: [createTreeDuplicates()],
    hasNoDuplicates: [
      createSingleNodeTree(123),
      createTreeCompleteAndFull(),
      createTreeCompleteOnly(),
      createTreeFullOnly(),
      createTreePerfect(),
      createTree(),
    ],
    isComplete: [
      createSingleNodeTree(123),
      createTreeCompleteAndFull(),
      createTreeCompleteOnly(),
      createTreePerfect(),
    ],
    isNotComplete: [
      createTree(),
      createTreeFullOnly(),
      createTreeNotCompleteMutantCheck(),
    ],
    isFull: [
      createSingleNodeTree(123),
      createTreeCompleteAndFull(),
      createTreeFullOnly(),
      createTreePerfect(),
    ],
    isNotFull: [
      createTree(),
      createTreeCompleteOnly(),
      createTreeNotCompleteMutantCheck(),
    ],
    isPerfect: [createTreePerfect()],
    isNotPerfect: [
      createTreeCompleteAndFull(),
      createTreeCompleteOnly(),
      createTreeFullOnly(),
      createTree(),
      createTreeNotCompleteMutantCheck(),
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
        (tree as BinaryTree<number>).root,
      );
      expect(testArray).toStrictEqual(expectedArray);
    },
  );

describe("traversal", () => {
  describe("in-order traversal", () => {
    traversalCase(
      cases.traversal.inOrder,
      "in-order",
      BinaryTree.inOrderTraversal<number>,
    );
  });
  describe("pre-order traversal", () => {
    traversalCase(
      cases.traversal.preOrder,
      "pre-order",
      BinaryTree.preOrderTraversal<number>,
    );
  });
  describe("post-order traversal", () => {
    traversalCase(
      cases.traversal.postOrder,
      "post-order",
      BinaryTree.postOrderTraversal<number>,
    );
  });
});

const checkCase = (
  caseSet: CheckCaseSet,
  checkDescription: string,
  checkFunction: (tree: BinaryTree<number>) => boolean,
) =>
  it.each(caseSet)(
    `given binary tree %p, returns ${checkDescription}`,
    (tree) => {
      expect(checkFunction(tree)).toBe(true);
    },
  );

describe("tree qualities", () => {
  checkCase(cases.checks.hasDuplicates, "hasDuplicates === true", (tree) =>
    tree.hasDuplicates(),
  );
  checkCase(
    cases.checks.hasNoDuplicates,
    "hasDuplicates === false",
    (tree) => !tree.hasDuplicates(),
  );
  checkCase(cases.checks.isComplete, "isComplete === true", (tree) =>
    tree.isComplete(),
  );
  checkCase(
    cases.checks.isNotComplete,
    "isComplete === false",
    (tree) => !tree.isComplete(),
  );
  checkCase(cases.checks.isFull, "isFull === true", (tree) => tree.isFull());
  checkCase(
    cases.checks.isNotFull,
    "isFull === false",
    (tree) => !tree.isFull(),
  );
  checkCase(cases.checks.isPerfect, "isPerfect === true", (tree) =>
    tree.isPerfect(),
  );
  checkCase(
    cases.checks.isNotPerfect,
    "isPerfect === false",
    (tree) => !tree.isPerfect(),
  );
  checkCase(cases.checks.isValid, "isValidBinarySearchTree === true", (tree) =>
    tree.isValidBinarySearchTree(),
  );
  checkCase(
    cases.checks.isNotValid,
    "isValidBinarySearchTree === false",
    (tree) => !tree.isValidBinarySearchTree(),
  );
});
