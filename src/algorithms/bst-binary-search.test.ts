import { randomInt } from "crypto";
import { BinaryTree } from "../data-structures/binary-tree";
import {
  createSingleNodeTree,
  createTree,
  createTreeCompleteAndFull,
  createTreeCompleteOnly,
  createTreeDuplicates,
  createTreeFullOnly,
  createTreePerfect,
} from "../data-structures/binary-tree.test";
import { binarySearch } from "./bst-binary-search";

type Case = [BinaryTree<number>, string];

const searchCases: Case[] = [
  [createSingleNodeTree(123), "single node"],
  [createTreeCompleteAndFull(), "complete and full"],
  [createTreeCompleteOnly(), "complete"],
  [createTreeDuplicates(), "duplicates"],
  [createTreeFullOnly(), "full"],
  [createTreePerfect(), "perfect"],
  [createTree(), "not complete/full/perfect"],
];

describe("BST binary search", () => {
  it.each(searchCases)(
    "search for value which exists within tree %p (%p) yields value",
    (input, desc) => {
      const array: Array<number> = [];
      const root = input.root;
      BinaryTree.inOrderTraversal<number>((node) => {
        array.push(node.data);
      }, root);
      for (let i = 0; i < 20; i++) {
        const randomSearchValue = array[randomInt(array.length)];
        expect(binarySearch(root, randomSearchValue)?.data).toBe(
          randomSearchValue,
        );
      }
    },
  );
  it.each(searchCases)(
    "search for value which does not exist within tree %p (%p) yields null",
    (input, desc) => {
      const array: Array<number> = [-10, -5, -1, 0, 21, 25, 50, 100];
      const root = input.root;
      for (const searchValue of array) {
        expect(binarySearch(root, searchValue)).toBe(null);
      }
    },
  );
});
