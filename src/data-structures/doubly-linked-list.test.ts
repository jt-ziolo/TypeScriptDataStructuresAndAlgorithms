import { DoublyLinkedList } from "./doubly-linked-list";
import { baseLinkedNodeTests } from "./linked-list.test";
import { DoublyLinkedNode } from "./linked-node";

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

describe("doubly linked list, reversed (previous) traversal", () => {
  test("something", () => {
    expect(5).toBe(5);
  });
});
