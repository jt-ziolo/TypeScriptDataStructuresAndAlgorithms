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

  return new AVLTree(root);
};

describe("AVL tree", () => {
  describe("getBalance", () => {
    it.each([
      [createBalancedAVLTree(), 0],
      [createLeftLeftShapeAVLTree(), 2],
      [createLeftRightShapeAVLTree(), 2],
      [createRightLeftShapeAVLTree(), -2],
    ])(`given AVL tree %p, returns balance of %p`, (tree, expectedBalance) => {
      expect(AVLTree.getBalance(tree.root)).toBe(expectedBalance);
    });
  });
  describe("rotateRight", () => {
    it.each([[createLeftLeftShapeAVLTree(), createBalancedAVLTree()]])(
      `given AVL tree %p, rotating right returns AVL tree %p`,
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
      `given AVL tree %p, rotating left returns AVL tree %p`,
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
});
