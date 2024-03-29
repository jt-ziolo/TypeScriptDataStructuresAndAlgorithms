import { randomInt } from "crypto";
import { LinkedList } from "./linked-list";
import { LinkedNode, SinglyLinkedNode } from "./linked-node";
import { SinglyLinkedList } from "./singly-linked-list";

// Export these tests as a fixture, allowing for them to be reused
// for doubly linked list testing
export const baseLinkedNodeTests = (
  typeDescription: string,
  constructList: (node?: LinkedNode<number>) => LinkedList<number>,
  constructNode: (value: number) => LinkedNode<number>,
) =>
  describe(`${typeDescription} linked list`, () => {
    it("default constructor does not assign a root", () => {
      // Arrange
      const list = constructList();
      // Act/Assert
      expect(list.root).toBeUndefined();
      expect(list.length).toBe(0);
    });

    it("constructor successfully assigns root node when one is provided", () => {
      // Arrange
      const root = constructNode(10);
      const list = constructList(root);
      // Act/Assert
      expect(list.length).not.toBe(0);
      expect(list.length).toBe(1);
      expect(list.root).toBe(root);
    });

    it("linked list nodes can be connected and traversed", () => {
      // Arrange
      const root = constructNode(0);
      let last = undefined;
      // Act/Assert
      for (let i = 0; i < 10; i++) {
        const next = constructNode(i + 1);
        if (i == 0) {
          root.next = next;
          last = next;
          continue;
        }
        last!.next = next;
        last = next;
      }
      expect(root.data).toBe(0);
      last = root;
      let count = 0;
      while (last.next !== undefined) {
        expect(last.data).toBe(count);
        last = last.next!;
        count += 1;
      }
      expect(count).toBe(10);
    });

    it("node data is accessible", () => {
      // Arrange
      const listNode = constructNode(850);
      // Act/Assert
      expect(listNode.data).toBe(850);
    });

    describe("empty", () => {
      let list: LinkedList<number> | undefined;

      beforeEach(() => {
        list = constructList();
      });

      it("length is correct", () => {
        expect(list!.length).toBe(0);
      });

      it("insertBeginning sets newRoot as the root for an empty linked list", () => {
        // Arrange
        list = list as LinkedList<number>;
        // Act
        list.insertBeginning(constructNode(0));
        // Assert
        expect(list.root).not.toBeUndefined();
        expect(list.root!.data).toBe(0);
        expect(list.length).toBe(1);
      });

      it("removeBeginning does nothing for an empty linked list", () => {
        // Arrange
        list = list as LinkedList<number>;
        // Act
        list.removeBeginning();
        // Assert
        expect(list.root).toBeUndefined();
        expect(list.length).toBe(0);
      });

      it("empty linked list is not iterable", () => {
        // Arrange
        list = list as LinkedList<number>;
        // Act
        let count = 0;
        for (const _ of list) {
          count += 1;
        }
        // Assert
        expect(count).toBe(0);
      });
    });

    describe("with 1 element", () => {
      let list: LinkedList<number> | undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let randomNodeValue = 0;

      beforeEach(() => {
        list = constructList();
        randomNodeValue = randomInt(10000);
        list.insertBeginning(constructNode(randomNodeValue));
      });

      it("length is correct", () => {
        expect(list!.length).toBe(1);
      });

      it("removeAfter does nothing", () => {
        // Arrange
        list = list as LinkedList<number>;
        // Act
        list.removeAfter(list.root!);
        // Assert
        expect(list.root).toBeDefined();
        expect(list.length).toBe(1);
        expect(list.root!.data).toBe(randomNodeValue);
      });

      it("removeBeginning deletes the root node's properties", () => {
        // Arrange
        list = list as LinkedList<number>;
        // Act
        const root = list.root;
        list.removeBeginning();
        // Assert
        expect(root).not.toHaveProperty("next");
        expect(list.length).toBe(0);
      });
    });

    describe("with 3 elements", () => {
      let list: LinkedList<number> | undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let randomNodeValue = 0;

      beforeEach(() => {
        list = constructList();
        randomNodeValue = randomInt(10000);
        list.insertBeginning(constructNode(1));
        let last = list.root!;
        for (let i = 0; i < 2; i++) {
          const next = constructNode(i + 1);
          last.next = next;
          last = next;
        }
      });

      it("linked list length is correct", () => {
        expect(list!.length).toBe(3);
      });

      it("insertAfter places newNode in correct position", () => {
        // Arrange
        list = list as LinkedList<number>;
        // Act
        list.insertAfter(list.root!.next!, constructNode(randomNodeValue));
        // Assert
        expect(list.root!.next!.next!.data).toBe(randomNodeValue);
      });

      it("insertBeginning places newRoot in correct position", () => {
        // Arrange
        list = list as LinkedList<number>;

        const oldRootData = list!.root!.data;
        list.insertBeginning(constructNode(randomNodeValue));
        expect(list!.root!.next!.data).toBe(oldRootData);
      });

      it("insertBeginning sets newRoot's child to old root", () => {
        // Arrange
        list = list as LinkedList<number>;

        list.insertBeginning(constructNode(randomNodeValue));
        expect(list.root!.data).toBe(randomNodeValue);
      });

      it("length is reduced by 1 after calling removeAfter", () => {
        // Arrange
        list = list as LinkedList<number>;

        expect(list.length).toBe(3);
        list.removeAfter(list.root!);
        expect(list.length).toBe(2);
      });

      it("removeAfter removes the correct node", () => {
        // Arrange
        list = list as LinkedList<number>;
        const target = list.root!.next;

        list.removeAfter(list.root!);
        const newRootChild = list.root!.next;
        expect(newRootChild).not.toBeUndefined();
        expect(newRootChild).not.toBe(target);
      });

      it("removeBeginning removes the root and replaces it with the child", () => {
        // Arrange
        list = list as LinkedList<number>;
        const oldRoot = list.root!;
        const oldRootChild = oldRoot.next;

        list.removeBeginning();
        expect(list.root).not.toBe(oldRoot);
        expect(list.root).toBe(oldRootChild);
      });
    });

    describe("with many elements", () => {
      let list: LinkedList<number> | undefined;

      beforeAll(() => {
        list = constructList();
        list.insertBeginning(constructNode(-1));
        let last = list.root!;
        for (let i = 0; i < 999; i++) {
          const next = constructNode(i + 1);
          last.next = next;
          last = next;
        }
      });

      it("linked list length is correct", () => {
        expect(list!.length).toBe(1000);
      });

      it("can iterate through list", () => {
        const lastFiveItemsData = [];
        for (const item of list!) {
          lastFiveItemsData.unshift(item?.data);
          if (lastFiveItemsData.length > 5) {
            lastFiveItemsData.pop();
          }
        }
        expect(lastFiveItemsData).toEqual([999, 998, 997, 996, 995]);
      });
    });
  });

baseLinkedNodeTests(
  "singly",
  (node) => {
    if (node === undefined) {
      return new SinglyLinkedList<number>(node);
    }
    return new SinglyLinkedList<number>(node);
  },
  (value) => {
    return new SinglyLinkedNode<number>(value);
  },
);
