import { Collection } from "../util";
import { selectionSort } from "./sort-linear-collection";

const arraySwapFunction = (
  collection: Collection<number>,
  fromIndex: number,
  toIndex: number,
): void => {
  const array = collection as Array<number>;
  const fromValue = array[fromIndex];
  array[fromIndex] = array[toIndex];
  array[toIndex] = fromValue;
};

describe("selection sort", () => {
  it("does not throw an error when called on an empty array", () => {
    const array: Array<number> = [];
    selectionSort(array, arraySwapFunction);
    expect(array).toEqual([]);
    expect(array.length).toBe(0);
  });
  it("does nothing when called on an array with 1 element", () => {
    for (let i = 0; i < 10000; i++) {
      const array: Array<number> = [i];
      selectionSort(array, arraySwapFunction);
      expect(array).toEqual([i]);
      expect(array.length).toBe(1);
    }
  });
});
