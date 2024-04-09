import { randomInt } from "crypto";
import { SkipList } from "./skip-list";
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
    describe("includes collection params", () => {
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
  describe.skip("insert", () => {});
});
