import { BinaryTree } from "./binary-tree";
import { BinaryTreeNode } from "./binary-tree-node";
import { RedBlackTree, RedBlackTreeNodeDataWrapper } from "./red-black-tree";

type RedBlackTreeNumberNode = RedBlackTreeNodeDataWrapper<number>;

// Chose these characters based on Cracking the Coding Interview examples
type CharString = "G" | "P" | "U" | "N" | "R" | "a" | "b" | "c";
type RedBlackTreeCharNode = RedBlackTreeNodeDataWrapper<CharString>;

const createValidRedBlackTree = () => {
  /*
   *               ____________(b10)___________
   *              /                            \
   *       ____(r5)____                       (b20)____
   *      /            \                               \
   *    (b2)      ____(b8)____                       (r30)
   *             /            \
   *          (r6)           (r9)
   */
  const root = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 10,
    isRed: false,
  });

  let next = root;
  next.left = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 5,
    isRed: true,
  });
  next.right = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 20,
    isRed: false,
  });
  next.right.right = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 30,
    isRed: true,
  });

  next = next.left;
  next.left = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 2,
    isRed: false,
  });
  next.right = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 8,
    isRed: false,
  });

  next = next.right;
  next.left = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 6,
    isRed: true,
  });
  next.right = new BinaryTreeNode<RedBlackTreeNumberNode>({
    innerData: 9,
    isRed: true,
  });

  return new RedBlackTree(root);
};

const createRedBlackTreeCase1 = () => {
  /*
   *               ____________(bR)___________
   *              /                            \
   *       ____(bG)____                   ____(ra)____
   *      /            \                 /            \
   *    (rP)          (rU)             (bb)          (bc)
   */
  const root = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "R",
    isRed: false,
  });
  root.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "G",
    isRed: false,
  });
  root.right = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "a",
    isRed: true,
  });

  let next = root.left;
  next.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "P",
    isRed: true,
  });
  next.right = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "U",
    isRed: true,
  });

  next = root.right;
  next.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "b",
    isRed: false,
  });
  next.right = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "c",
    isRed: false,
  });

  return new RedBlackTree(root);
};

const createRedBlackTreeCase1AfterInsert = () => {
  /*
   *                   ____________(bR)___________
   *                  /                            \
   *           ____(rG)____                   ____(ra)____
   *          /            \                 /            \
   *      __(bP)          (bU)             (bb)          (bc)
   *    /
   *  (rN)
   */
  const root = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "R",
    isRed: false,
  });
  root.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "G",
    isRed: true,
  });
  root.right = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "a",
    isRed: true,
  });

  let next = root.left;
  next.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "P",
    isRed: false,
  });
  next.left.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "N",
    isRed: true,
  });
  next.right = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "U",
    isRed: false,
  });

  next = root.right;
  next.left = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "b",
    isRed: false,
  });
  next.right = new BinaryTreeNode<RedBlackTreeCharNode>({
    innerData: "c",
    isRed: false,
  });

  return new RedBlackTree(root);
};

describe("Red-black tree", () => {
  describe("IsValidRedBlackTree", () => {
    let tree: RedBlackTree<number>;
    beforeEach(() => {
      tree = createValidRedBlackTree();
    });
    it("returns true given a valid red-black tree", () => {
      expect(tree.isValidRedBlackTree()).toBe(true);
    });
    it("returns false given an invalid red-black tree (not a valid BST)", () => {
      tree.root.data.innerData = 21;
      expect(tree.isValidRedBlackTree()).toBe(false);
    });
    it("returns false given an invalid red-black tree (root is red)", () => {
      tree.root.data.isRed = true;
      expect(tree.isValidRedBlackTree()).toBe(false);
    });
    it("returns false given an invalid red-black tree (a red node has a red child node)", () => {
      const node = tree.root.left!.left!;
      node.data.isRed = true;
      node.left = new BinaryTreeNode<RedBlackTreeNumberNode>({
        innerData: 1,
        isRed: false,
      });
      node.right = new BinaryTreeNode<RedBlackTreeNumberNode>({
        innerData: 3,
        isRed: false,
      });
      expect(tree.isValidRedBlackTree()).toBe(false);
    });
    it("returns false given an invalid red-black tree (there are more black child nodes on one path than another)", () => {
      tree.root.right!.left = new BinaryTreeNode<RedBlackTreeNumberNode>({
        innerData: 25,
        isRed: false,
      });
      expect(tree.isValidRedBlackTree()).toBe(false);
    });
  });
  describe("insertion", () => {
    it.skip("matches expected tree (case 1, U is red)", () => {
      const tree: RedBlackTree<CharString> = createRedBlackTreeCase1();
      const expected: RedBlackTree<CharString> =
        createRedBlackTreeCase1AfterInsert();
      tree.insert("N");
      expect(tree.isValidRedBlackTree()).toBe(true);

      const array: Array<CharString> = [];
      RedBlackTree.inOrderTraversal((node) => {
        array.push(node.data.innerData);
      }, tree.root);

      const expectedArray: Array<CharString> = [];
      RedBlackTree.inOrderTraversal((node) => {
        expectedArray.push(node.data.innerData);
      }, expected.root);

      expect(array).toStrictEqual(expectedArray);
    });
  });
});
