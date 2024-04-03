import { randomInt } from "crypto";
import { Stack, StackArray, StackLinkedList } from "./stack";

const baseStackTests = (
  typeDescription: string,
  stackConstructor: (iterable?: Iterable<number>) => Stack<number>,
) => {
  describe(`stack (${typeDescription})`, () => {
    describe("constructor", () => {
      it("should successfully initialize the elements of a stack given an iterable", () => {
        const stack = stackConstructor([1, 2, 3]);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
      });
    });
    describe("push, pop, top", () => {
      it("popping elements off of an empty stack should not change the length", () => {
        const stack = stackConstructor();
        stack.push(1);
        expect(stack.length).toBe(1);
        for (let i = 0; i < 10; i++) {
          stack.pop();
          expect(stack.length).toBe(0);
        }
      });
      it("should successfully push an element onto an empty stack", () => {
        for (let i = 0; i < 100; i++) {
          const stack = stackConstructor();
          const randomNum = randomInt(1000);
          stack.push(randomNum);
          expect(stack.top).toBe(randomNum);
        }
      });
      it("should support duplicate elements", () => {
        const stack = stackConstructor([1, 2, 3, 3, 3]);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(3);
        expect(stack.pop()).toBe(2);
        expect(stack.pop()).toBe(1);
      });
      it("should successfully push an element onto a stack containing non-duplicate elements", () => {
        const stack = stackConstructor();
        for (let i = 0; i < 100; i++) {
          stack.push(i);
        }
        expect(stack.length).toBe(100);
        stack.push(100);
        expect(stack.length).toBe(101);
        expect(stack.top).not.toBe(0);
        for (let i = 0; i < 100; i++) {
          stack.pop();
        }
        expect(stack.length).toBe(1);
        expect(stack.top).toBe(0);
      });
      it("should be able to pop and then push elements onto the stack successfully", () => {
        const stack = stackConstructor();
        for (let i = 0; i < 10; i++) {
          stack.push(i);
          stack.push(i);
          stack.pop();
        }
        expect(stack.length).toBe(10);
        expect(stack.top).toBe(9);
      });
      it("should return undefined for the top element of an empty stack", () => {
        const stack = stackConstructor();
        expect(stack.top).toBe(undefined);
      });
    });
    describe("isEmpty", () => {
      it("should indicate that an empty stack is empty", () => {
        const stack = stackConstructor();
        expect(stack.length).toBe(0);
        expect(stack.isEmpty).toBe(true);
      });
      it("should indicate that a previously filled but now-empty stack is empty", () => {
        // Arrange
        const stack = stackConstructor([1, 2, 3]);
        expect(stack.length).not.toBe(0);
        expect(stack.isEmpty).not.toBe(true);
        // Act
        stack.pop();
        stack.pop();
        stack.pop();
        // Assert
        expect(stack.length).toBe(0);
        expect(stack.isEmpty).toBe(true);
      });
    });
  });
};

baseStackTests("array implementation", (iterable) => {
  return new StackArray(iterable);
});
baseStackTests("LinkedList implementation", (iterable) => {
  return new StackLinkedList(iterable);
});
