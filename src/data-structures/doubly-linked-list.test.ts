import { randomInt } from "crypto";
import { DoublyLinkedList } from "./doubly-linked-list";
import { baseLinkedNodeTests } from "./linked-list.test";
import { DoublyLinkedNode, DoublyLinkedRootNode } from "./linked-node";

// Repeat singly-linked-list tests that are non-specific to that data structure
baseLinkedNodeTests(
  "doubly",
  (node) => {
    return new DoublyLinkedList(node);
  },
  (value) => {
    return new DoublyLinkedNode(value);
  },
);

describe("doubly linked list (specific)", () => {
  it("sets root node data correctly", () => {
    const value = randomInt(10000);
    const list = new DoublyLinkedList<number>(
      new DoublyLinkedRootNode<number>(value),
    );
    expect(list.root?.data).toBe(value);
  });

  describe("removeAfter", () => {
    it("sets the previous node of the node following the removed node correctly", () => {
      const list = new DoublyLinkedList<number>();
      let currentNode = new DoublyLinkedNode<number>(0);
      list.insertBeginning(currentNode);
      for (let i = 1; i < 10; i++) {
        const lastNode = currentNode;
        currentNode = new DoublyLinkedNode<number>(i);
        list.insertAfter(lastNode, currentNode);
      }

      let count = 0;
      currentNode = list.root!.next!;
      const middleIdx = 2 + randomInt(4);
      while (currentNode.next !== undefined) {
        // Test somewhere in the middle, and the node before the tail
        if (count === middleIdx || count === list.length - 2) {
          list.removeAfter(currentNode);
        }
        currentNode = currentNode.next;
        count += 1;
      }

      let prevNode: DoublyLinkedNode<number> | DoublyLinkedRootNode<number> =
        list.root!;
      currentNode = prevNode.next!;
      while (currentNode.next !== undefined) {
        currentNode = currentNode.next;
        prevNode = prevNode.next!;
        expect(currentNode.previous).toBe(prevNode);
        expect(prevNode.next).toBe(currentNode);
      }
    });
  });

  const frontToBackTraversalTest = (currentNode: DoublyLinkedNode<number>) => {
    let count = 999;
    expect(currentNode!.next).toBeUndefined();
    while (currentNode!.previous !== undefined) {
      expect(currentNode!.data).toEqual(count);
      count -= 1;
      currentNode = currentNode!.previous;
    }
  };

  const scanningTraversalTest = (
    list: DoublyLinkedList<number>,
    currentNode: DoublyLinkedNode<number>,
  ) => {
    currentNode = list.root!;
    expect(currentNode.previous).toBeUndefined();
    currentNode = currentNode.next!;
    let count = 1;
    while (currentNode.next !== undefined) {
      expect(currentNode.data).toEqual(count);
      count -= 1;
      currentNode = currentNode.previous!;
      expect(currentNode.data).toEqual(count);
      count += 2;
      currentNode = currentNode.next!.next!;
      expect(currentNode.data).toEqual(count);
    }
  };

  describe("constructed with many scattered insertAfter/removeAfter calls", () => {
    let list: DoublyLinkedList<number> | undefined;
    let currentNode: DoublyLinkedNode<number> | undefined;
    let lastNode: DoublyLinkedNode<number> | undefined;

    beforeEach(() => {
      list = new DoublyLinkedList<number>();
      currentNode = new DoublyLinkedNode<number>(0);
      list.insertBeginning(currentNode);
      const toBeRemovedAndReAdded: Array<DoublyLinkedNode<number>> = [];
      for (let i = 1; i < 1000; i++) {
        lastNode = currentNode;
        currentNode = new DoublyLinkedNode<number>(i);
        list.insertAfter(lastNode, currentNode);
        if (randomInt(2) === 0) {
          // 33% chance
          toBeRemovedAndReAdded.push(currentNode);
        }
      }
      for (const currentNode of toBeRemovedAndReAdded) {
        const data = currentNode.data;
        const previousNode = currentNode.previous!;
        list.removeAfter(previousNode);
        list.insertAfter(previousNode, new DoublyLinkedNode<number>(data));
      }
    });

    it("is correctly traversed back-to-front", () => {
      frontToBackTraversalTest(currentNode!);
    });

    it("is correctly traversed in a back-and-forth scan pattern", () => {
      scanningTraversalTest(list!, currentNode!);
    });
  });

  describe("constructed by successive insertAfter calls at tail only", () => {
    let list: DoublyLinkedList<number> | undefined;
    let currentNode: DoublyLinkedNode<number> | undefined;
    let lastNode: DoublyLinkedNode<number> | undefined;

    beforeEach(() => {
      list = new DoublyLinkedList<number>();
      currentNode = new DoublyLinkedNode<number>(0);
      list.insertBeginning(currentNode);
      for (let i = 1; i < 1000; i++) {
        lastNode = currentNode;
        currentNode = new DoublyLinkedNode<number>(i);
        list.insertAfter(lastNode, currentNode);
      }
    });

    it("is correctly traversed back-to-front", () => {
      frontToBackTraversalTest(currentNode!);
    });

    it("is correctly traversed in a back-and-forth scan pattern", () => {
      scanningTraversalTest(list!, currentNode!);
    });
  });

  it("prohibits assignment of a previous node on the root", () => {
    // Arrange
    const list = new DoublyLinkedList<number>(new DoublyLinkedNode<number>(0));
    // Act/Assert
    expect(list.root!).not.toHaveProperty("previous");
    list.insertAfter(list.root!, new DoublyLinkedNode(1));
    expect(list.root!.next).toHaveProperty("previous");
    expect(list.root!.next?.previous).toBe(list.root);
  });
});
