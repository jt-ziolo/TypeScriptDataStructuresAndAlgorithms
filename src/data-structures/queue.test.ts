import { randomInt } from "crypto";
import { Queue, QueueArray, QueueLinkedList } from "./queue";

const baseQueueTests = (
  typeDescription: string,
  queueConstructor: (iterable?: Iterable<number>) => Queue<number>,
) => {
  describe(`queue (${typeDescription})`, () => {
    describe("constructor", () => {
      it("should successfully initialize the elements of a queue given an iterable", () => {
        const queue = queueConstructor([1, 2, 3]);
        expect(queue.remove()).toBe(1);
        expect(queue.remove()).toBe(2);
        expect(queue.remove()).toBe(3);
      });
    });
    describe("add, remove, first", () => {
      it("removing elements from an empty queue should not change the length", () => {
        const queue = queueConstructor();
        queue.add(1);
        expect(queue.length).toBe(1);
        for (let i = 0; i < 10; i++) {
          queue.remove();
          expect(queue.length).toBe(0);
        }
      });
      it("should successfully add an element to an empty queue", () => {
        for (let i = 0; i < 100; i++) {
          const queue = queueConstructor();
          const randomNum = randomInt(1000);
          queue.add(randomNum);
          expect(queue.first).toBe(randomNum);
        }
      });
      it("should support duplicate elements", () => {
        const queue = queueConstructor([1, 2, 3, 3, 3]);
        expect(queue.remove()).toBe(1);
        expect(queue.remove()).toBe(2);
        expect(queue.remove()).toBe(3);
        expect(queue.remove()).toBe(3);
        expect(queue.remove()).toBe(3);
      });
      it("should successfully add an element to the back of a queue containing non-duplicate elements", () => {
        const queue = queueConstructor();
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
      it("should be able to remove and then add elements successfully", () => {
        const queue = queueConstructor();
        for (let i = 0; i < 10; i++) {
          queue.add(i);
          queue.add(i);
          queue.remove();
        }
        expect(queue.length).toBe(10);
        expect(queue.first).toBe(5);
      });
      it("should return undefined for the first element of an empty queue", () => {
        const queue = queueConstructor();
        expect(queue.first).toBe(undefined);
      });
    });
    describe("isEmpty", () => {
      it("should indicate that an empty queue is empty", () => {
        const queue = queueConstructor();
        expect(queue.length).toBe(0);
        expect(queue.isEmpty).toBe(true);
      });
      it("should indicate that a previously filled but now-empty queue is empty", () => {
        // Arrange
        const queue = queueConstructor([1, 2, 3]);
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
};

baseQueueTests("array implementation", (iterable) => {
  return new QueueArray(iterable);
});
baseQueueTests("LinkedList implementation", (iterable) => {
  return new QueueLinkedList(iterable);
});
