import { randomInt } from "crypto";
import { Queue } from "./queue";

describe("queue", () => {
  describe("constructor", () => {
    it("should successfully initialize the elements of a queue given an iterable", () => {
      const queue = new Queue([1, 2, 3]);
      expect(queue.remove()).toBe(1);
      expect(queue.remove()).toBe(2);
      expect(queue.remove()).toBe(3);
    });
  });
  describe("add, remove, first", () => {
    it("should successfully add an element to an empty queue", () => {
      for (let i = 0; i < 100; i++) {
        const queue = new Queue();
        const randomNum = randomInt(1000);
        queue.add(randomNum);
        expect(queue.first).toBe(randomNum);
      }
    });
    it("should successfully add an element to the back of a queue containing non-duplicate elements", () => {
      const queue = new Queue();
      for (let i = 0; i < 100; i++) {
        queue.add(i);
      }
      expect(queue.length).toBe(100);
      queue.add(100);
      expect(queue.length).toBe(101);
      expect(queue.first).not.toBe(100);
      for (let i = 0; i < 100; i++) {
        queue.remove();
      }
      expect(queue.length).toBe(1);
      expect(queue.first).toBe(100);
    });
  });
  describe("isEmpty", () => {
    it("should indicate that an empty queue is empty", () => {
      const queue = new Queue();
      expect(queue.length).toBe(0);
      expect(queue.isEmpty).toBe(true);
    });
    it("should indicate that a previously filled but now-empty queue is empty", () => {
      // Arrange
      const queue = new Queue([1, 2, 3]);
      expect(queue.length).not.toBe(0);
      expect(queue.isEmpty).not.toBe(true);
      // Act
      queue.remove();
      queue.remove();
      queue.remove();
      // Assert
      expect(queue.length).toBe(0);
      expect(queue.isEmpty).toBe(true);
    });
  });
});
