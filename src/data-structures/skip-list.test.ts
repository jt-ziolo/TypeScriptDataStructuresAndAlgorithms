import { randomInt } from "crypto";
import { SkipList, SkipListNode } from "./skip-list";
import { arrayCopyToFunction, arrayEmptyConstructor } from "../util";

const probabilityFunctions = {
  always() {
    // will cause an infinite loop if maxPromotions is not set
    return true;
  },
  half() {
    return randomInt(2) === 0;
  },
};

const createCollectionParams = (array: Array<number>) => {
  return {
    collection: array,
    copyToFunction: arrayCopyToFunction,
    constructor: arrayEmptyConstructor,
  };
};

describe("skip list", () => {
  describe("constructor", () => {
    describe("no collection parameter passed in", () => {
      let list: SkipList<number>;
      beforeEach(() => {
        list = new SkipList<number>(probabilityFunctions.half);
      });

      it("does not assign a head", () => {
        expect(list.head).toBeUndefined();
      });

      it("returns zero length", () => {
        expect(list.length).toBe(0);
      });
    });
    describe("empty array collection parameter passed in", () => {
      let list: SkipList<number>;
      beforeEach(() => {
        list = new SkipList<number>(
          probabilityFunctions.half,
          createCollectionParams([]),
        );
      });

      it("does not assign a head", () => {
        expect(list.head).toBeUndefined();
      });

      it("returns zero length", () => {
        expect(list.length).toBe(0);
      });
    });
    describe("includes fixed collection params", () => {
      let list: SkipList<number>;
      const inputArray = [1, 2, 3, 4, 5];
      beforeEach(() => {
        list = new SkipList<number>(
          probabilityFunctions.half,
          createCollectionParams(inputArray),
        );
      });

      it("assigns a head with the correct value", () => {
        expect(list.head?.data).toBe(1);
      });

      it("returns the correct length", () => {
        expect(list.length).toBe(5);
      });

      it("returns the correct values for the lowest layer", () => {
        expect(list.values).toStrictEqual([1, 2, 3, 4, 5]);
      });
    });
    describe("includes long collection params", () => {
      let list: SkipList<number>;
      let inputArray = Array.from<number>({ length: 1000 });
      inputArray = inputArray.map((_, index) => index);
      beforeEach(() => {
        list = new SkipList<number>(
          probabilityFunctions.half,
          createCollectionParams(inputArray),
        );
      });

      it("returns the correct length", () => {
        expect(list.length).toBe(1000);
      });
    });
    describe("includes maxPromotions arg", () => {
      let list: SkipList<number>;
      const inputArray = [1, 2, 3, 4, 5];
      beforeEach(() => {
        list = new SkipList<number>(
          probabilityFunctions.always,
          createCollectionParams(inputArray),
          10,
        );
      });

      it("results in a list 10 layers deep", () => {
        let count = 0;
        for (let node = list.head!; node.down !== undefined; node = node.down) {
          count += 1;
        }
        expect(count).toBe(10);
      });
    });
  });
  describe.skip("search", () => {});
  describe("insert", () => {
    let list: SkipList<number>;
    beforeEach(() => {
      list = new SkipList<number>(
        probabilityFunctions.half,
        createCollectionParams([]),
      );
    });

    it("should insert a new head node when called on an empty list", () => {
      expect(list.head).toBeUndefined();
      list.insert(123);
      expect(list.head).toBeDefined();
      expect(list.head!.data).toBe(123);
    });

    it("should not alter the list structure when attempting to add duplicate elements", () => {
      list.insert(1);
      list.insert(2);
      list.insert(3);
      expect(list.length).toBe(3);
      const initial = list.toString();
      list.insert(3);
      expect(list.length).toBe(3);
      expect(list.toString()).toStrictEqual(initial);
    });

    it("should trigger random promotions", () => {
      let previousState = "";
      for (let i = 0; i < 100; i++) {
        list = new SkipList<number>(
          probabilityFunctions.half,
          createCollectionParams([]),
        );
        for (let j = 0; j < 100; j++) {
          list.insert(j);
        }
        const currentState = list.toString();
        // for the first iteration, this assertion is less important but does
        // not need to be skipped
        expect(currentState).not.toStrictEqual(previousState);
        previousState = currentState;
      }
    });
  });
  describe.skip("remove", () => {});
});
