import { randomInt } from "crypto";
import { Collection, Index } from "../util";
import {
  CopyToFunction,
  NewFunction,
  SwapFunction,
  bubbleSort,
  mergeSort,
  selectionSort,
} from "./sort-linear-collection";

const arraySwapFunction: SwapFunction<number> = (
  collection: Collection<number>,
  fromIndex: number,
  toIndex: number,
): void => {
  const array = collection as Array<number>;
  const fromValue = array[fromIndex];
  array[fromIndex] = array[toIndex];
  array[toIndex] = fromValue;
};

export const arrayCopyToFunction: CopyToFunction<number> = (
  fromCollection: Collection<number>,
  toCollection: Collection<number>,
  fromIndex: Index,
  toIndex: Index,
) => {
  const fromArray = fromCollection as Array<number>;
  const toArray = toCollection as Array<number>;
  toArray[toIndex] = fromArray[fromIndex];
};

const arrayNewFunction: NewFunction<number> = (length: number) => {
  return Array.from<number>({ length: length });
};

export const baseSortAlgorithmTests = (
  description: string,
  sortFunction: (collection: Collection<number>) => void,
  testNegativeElements: boolean = true,
) => {
  return describe(description, () => {
    it("does not throw an error when called on an empty array", () => {
      const array: Array<number> = [];
      sortFunction(array);
      expect(array).toEqual([]);
      expect(array.length).toBe(0);
    });

    it("does nothing when called on an array with 1 element", () => {
      for (let i = 0; i < 100; i++) {
        const array: Array<number> = [i];
        sortFunction(array);
        expect(array).toEqual([i]);
        expect(array.length).toBe(1);
      }
    });

    it("sorts an unsorted array containing 2 unique positive elements", () => {
      // Arrange
      const array: Array<number> = [];
      array.push(randomInt(10000));
      array.push(randomInt(10000));
      while (array.at(0)! <= array.at(1)!) {
        array.pop();
        array.push(randomInt(10000));
      }
      const arrayCopy = structuredClone(array);
      expect(array).toStrictEqual(arrayCopy);

      // Act
      sortFunction(array);

      // Assert
      expect(array).not.toStrictEqual(arrayCopy);
      expect(array.at(0)).toBe(arrayCopy.at(1));
      expect(array.at(1)).toBe(arrayCopy.at(0));
    });

    if (testNegativeElements) {
      it("sorts an unsorted array containing 2 unique negative elements", () => {
        // Arrange
        const array: Array<number> = [];
        array.push(-1 * randomInt(10000));
        array.push(-1 * randomInt(10000));
        while (array.at(0)! <= array.at(1)!) {
          array.pop();
          array.push(-1 * randomInt(10000));
        }
        const arrayCopy = structuredClone(array);
        expect(array).toStrictEqual(arrayCopy);

        // Act
        sortFunction(array);

        // Assert
        expect(array).not.toStrictEqual(arrayCopy);
        expect(array.at(0)).toBe(arrayCopy.at(1));
        expect(array.at(1)).toBe(arrayCopy.at(0));
      });

      it("sorts an unsorted array containing one negative and one positive element", () => {
        // Arrange
        const array: Array<number> = [];
        array.push(-1 * randomInt(10000));
        array.push(randomInt(10000));
        while (array.at(1)! === 0) {
          array.pop();
          array.push(randomInt(10000));
        }
        arraySwapFunction(array, 0, 1);

        const arrayCopy = structuredClone(array);
        expect(array).toStrictEqual(arrayCopy);

        // Act
        sortFunction(array);

        // Assert
        expect(array).not.toStrictEqual(arrayCopy);
        expect(array.at(0)).toBe(arrayCopy.at(1));
        expect(array.at(1)).toBe(arrayCopy.at(0));
      });
    }

    it("sorts through the final element of the input array", () => {
      // Arrange
      const array: Array<number> = [6, 4, 3, 5, 1, 2, 0];
      const arrayCopy = structuredClone(array);
      expect(array).toStrictEqual(arrayCopy);

      // Act
      sortFunction(array);

      // Assert
      expect(array).not.toStrictEqual(arrayCopy);
      expect(isSorted(array)).toBe(true);
    });

    it("returns the same order of elements when the input array is already sorted", () => {
      // Arrange
      const array: Array<number> = [0, 1, 2, 3, 4, 5, 6];
      const arrayCopy = structuredClone(array);
      expect(array).toStrictEqual(arrayCopy);

      // Act
      sortFunction(array);

      // Assert
      expect(array).toStrictEqual(arrayCopy);
    });

    const generateUnsortedArrayNoDuplicates = (length: number) => {
      const set = new Set<number>();

      for (let i = 0; i < length; i++) {
        set.add(randomInt(100000));
      }

      const array = Array.from(set);
      array.sort(() => {
        return randomInt(3) - 1;
      });
      return array;
    };

    const isSorted = (array: Array<number>): boolean => {
      if (array.length <= 1) {
        throw new Error("Expected array to have length > 1.");
      }
      for (let i = 1; i < array.length; i++) {
        if (array.at(i)! < array.at(i - 1)!) {
          return false;
        }
      }
      return true;
    };

    it("successfully sorts a large array containing only unique elements", () => {
      // Arrange
      const array: Array<number> = generateUnsortedArrayNoDuplicates(1000);
      const arrayCopy = structuredClone(array);
      expect(array).toStrictEqual(arrayCopy);
      expect(isSorted(array)).toBe(false);

      // Act
      sortFunction(array);

      // Assert
      expect(array).not.toStrictEqual(arrayCopy);
      expect(isSorted(array)).toBe(true);
    });

    const generateUnsortedArrayWithDuplicates = (length: number) => {
      const array = new Array<number>();

      for (let i = 0; i < length - 1; i++) {
        array.push(randomInt(length * 10));
      }

      // Make sure at least one repeat is present
      array.push(array.at(randomInt(length - 1))!);

      array.sort(() => {
        return randomInt(3) - 1;
      });

      return array;
    };

    it("successfully sorts a large array containing duplicate elements", () => {
      // Arrange
      const array: Array<number> = generateUnsortedArrayWithDuplicates(1000);
      const arrayCopy = structuredClone(array);
      expect(array).toStrictEqual(arrayCopy);
      expect(isSorted(array)).toBe(false);

      // Act
      sortFunction(array);

      // Assert
      expect(array).not.toStrictEqual(arrayCopy);
      expect(isSorted(array)).toBe(true);
    });
  });
};

baseSortAlgorithmTests(
  "selection sort",
  function (collection: Collection<number>) {
    selectionSort(collection, arraySwapFunction);
  },
);
baseSortAlgorithmTests(
  "bubble sort",
  function (collection: Collection<number>) {
    bubbleSort(collection, arraySwapFunction);
  },
);
baseSortAlgorithmTests("merge sort", function (collection: Collection<number>) {
  mergeSort(collection, arrayCopyToFunction, arrayNewFunction);
});
