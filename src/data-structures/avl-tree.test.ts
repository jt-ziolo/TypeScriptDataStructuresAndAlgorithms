import {
  AVLTree,
  AVLTreeNodeDataWrapper,
  BinaryTree,
} from "./binary-search-tree";
import { BinaryTreeNode } from "./binary-tree-node";

type AVLTreeNode = AVLTreeNodeDataWrapper<number>;

const createBalancedAVLTree = () => {
  /*
   *               ____________(20)____________
   *              /                            \
   *       ____(10)____                   ____(30)____
   *      /            \                 /            \
   *    (5)           (15)             (25)          (35)
   */
  const root = new BinaryTreeNode<AVLTreeNode>({
    innerData: 20,
    height: 3,
  });

  let next = root;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 10, height: 2 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 30, height: 2 });

  next = next.left;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 5, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 15, height: 1 });

  next = root.right!;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 25, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 35, height: 1 });

  AVLTree.updateHeights(root);
  return new AVLTree(root);
};

const createLeftRightShapeAVLTree = () => {
  /*
   *               ____________(30)____________
   *              /                            \
   *       ____(10)____                       (35)
   *      /            \
   *    (5)       ____(20)____
   *             /            \
   *          (15)           (25)
   */
  const root = new BinaryTreeNode<AVLTreeNode>({
    innerData: 30,
    height: 4,
  });

  let next = root;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 10, height: 3 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 35, height: 1 });

  next = next.left;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 5, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 20, height: 2 });

  next = next.right;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 15, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 25, height: 1 });

  AVLTree.updateHeights(root);
  return new AVLTree(root);
};

const createLeftLeftShapeAVLTree = () => {
  /*
   *                    ____________(30)____________
   *                   /                            \
   *            ____(20)____                       (35)
   *           /            \
   *     ____(10)____      (25)
   *    /            \
   *  (5)           (15)
   *
   */
  const root = new BinaryTreeNode<AVLTreeNode>({
    innerData: 30,
    height: 4,
  });

  let next = root;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 20, height: 3 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 35, height: 1 });

  next = next.left;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 10, height: 2 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 25, height: 1 });

  next = next.left;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 5, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 15, height: 1 });

  AVLTree.updateHeights(root);
  return new AVLTree(root);
};

const createRightLeftShapeAVLTree = () => {
  /*
   *      ____________(10)____________
   *     /                            \
   *   (5)                       ____(30)____
   *                            /            \
   *                      ____(20)____      (35)
   *                     /            \
   *                  (15)           (25)
   */
  const root = new BinaryTreeNode<AVLTreeNode>({
    innerData: 10,
    height: 4,
  });

  let next = root;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 5, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 30, height: 3 });

  next = next.right;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 20, height: 2 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 35, height: 1 });

  next = next.left;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 15, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 25, height: 1 });

  AVLTree.updateHeights(root);
  return new AVLTree(root);
};

const createRightRightShapeAVLTree = () => {
  /*
   *                    ____________(10)____________
   *                   /                            \
   *                 (5)                       ____(20)____
   *                                          /            \
   *                                        (15)      ____(30)____
   *                                                 /            \
   *                                              (25)           (35)
   *
   */
  const root = new BinaryTreeNode<AVLTreeNode>({
    innerData: 10,
    height: 4,
  });

  let next = root;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 5, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 20, height: 3 });

  next = next.right;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 15, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 30, height: 2 });

  next = next.right;
  next.left = new BinaryTreeNode<AVLTreeNode>({ innerData: 25, height: 1 });
  next.right = new BinaryTreeNode<AVLTreeNode>({ innerData: 35, height: 1 });

  AVLTree.updateHeights(root);
  return new AVLTree(root);
};

describe("AVL tree", () => {
  describe("getBalance", () => {
    it.each([
      [createBalancedAVLTree(), 0],
      [createLeftLeftShapeAVLTree(), 2],
      [createLeftRightShapeAVLTree(), 2],
      [createRightLeftShapeAVLTree(), -2],
    ])(`given %s, returns balance of %s`, (tree, expectedBalance) => {
      expect(AVLTree.getBalance(tree.root)).toBe(expectedBalance);
    });
  });
  describe("updateHeights", () => {
    it.each([
      [createBalancedAVLTree(), [1, 1, 2, 1, 1, 2, 4]],
      [createLeftLeftShapeAVLTree(), [1, 1, 2, 1, 3, 1, 4]],
      [createLeftRightShapeAVLTree(), [1, 1, 1, 2, 3, 1, 4]],
      [createRightLeftShapeAVLTree(), [1, 1, 1, 2, 1, 3, 4]],
      [createRightRightShapeAVLTree(), [1, 1, 1, 1, 2, 3, 4]],
    ])(
      `given %s, heights produced by post-order traversal are %s`,
      (tree, expectedHeights) => {
        const heights: Array<number> = [];

        BinaryTree.postOrderTraversal<AVLTreeNode>((node) => {
          heights.push(node.data.height);
        }, tree.root);

        expect(heights).toStrictEqual(expectedHeights);
      },
    );
  });
  describe("rotateRight", () => {
    it.each([[createLeftLeftShapeAVLTree(), createBalancedAVLTree()]])(
      `given %s, rotating right returns %s`,
      (tree, expectedTree) => {
        const originalTreeArray: Array<number> = [];
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          originalTreeArray.push(node.data.innerData);
        }, tree.root);

        const expectedTreeArray: Array<number> = [];
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          expectedTreeArray.push(node.data.innerData);
        }, expectedTree.root);

        const rotatedTreeArray: Array<number> = [];
        tree.rotateRight();
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          rotatedTreeArray.push(node.data.innerData);
        }, tree.root);

        expect(originalTreeArray).not.toStrictEqual(rotatedTreeArray);
        expect(rotatedTreeArray).toStrictEqual(expectedTreeArray);
      },
    );
  });
  describe("rotateLeft", () => {
    it.each([[createRightRightShapeAVLTree(), createBalancedAVLTree()]])(
      `given %s, rotating left returns %s`,
      (tree, expectedTree) => {
        const originalTreeArray: Array<number> = [];
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          originalTreeArray.push(node.data.innerData);
        }, tree.root);

        const expectedTreeArray: Array<number> = [];
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          expectedTreeArray.push(node.data.innerData);
        }, expectedTree.root);

        const rotatedTreeArray: Array<number> = [];
        tree.rotateLeft();
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          rotatedTreeArray.push(node.data.innerData);
        }, tree.root);

        expect(originalTreeArray).not.toStrictEqual(rotatedTreeArray);
        expect(rotatedTreeArray).toStrictEqual(expectedTreeArray);
      },
    );
  });
  describe("balance", () => {
    it.each([
      [createLeftRightShapeAVLTree(), "Left Right", createBalancedAVLTree()],
      [createLeftLeftShapeAVLTree(), "Left Left", createBalancedAVLTree()],
      [createRightLeftShapeAVLTree(), "Right Left", createBalancedAVLTree()],
      [createRightRightShapeAVLTree(), "Right Right", createBalancedAVLTree()],
    ])(
      `given %s (%s), balancing returns %s which is balanced`,
      (tree, _, expectedTree) => {
        const originalTreeArray: Array<number> = [];
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          originalTreeArray.push(node.data.innerData);
        }, tree.root);

        const expectedTreeArray: Array<number> = [];
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          expectedTreeArray.push(node.data.innerData);
        }, expectedTree.root);

        const balancedTreeArray: Array<number> = [];
        tree.balance(tree.root);
        BinaryTree.preOrderTraversal<AVLTreeNode>((node) => {
          balancedTreeArray.push(node.data.innerData);
          expect(AVLTree.getBalance(node)).toBeGreaterThanOrEqual(-1);
          expect(AVLTree.getBalance(node)).toBeLessThanOrEqual(1);
        }, tree.root);

        expect(originalTreeArray).not.toStrictEqual(balancedTreeArray);
        expect(balancedTreeArray).toStrictEqual(expectedTreeArray);
      },
    );
  });
});
