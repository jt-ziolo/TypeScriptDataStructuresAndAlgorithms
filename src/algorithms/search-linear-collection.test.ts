import { randomInt } from "crypto";
import { Index, binarySearch, linearSearch } from "./search-linear-collection";

type TestCase = {
  description: string;
  collection: Array<number>;
  searchValue: number;
  expectedIndex: Index;
};

const generateLongSortedList = (length: number) => {
  let list = Array.from({ length }, () => {
    return randomInt(length * 2);
  });
  const ensureAppearsOnce = randomInt(length * 2);
  list = list.filter((value, _) => {
    return value !== ensureAppearsOnce;
  });
  list.push(ensureAppearsOnce);
  list.sort((a, b) => a - b);
  const expectedIndex = list.indexOf(ensureAppearsOnce);
  return {
    collection: list,
    expectedIndex: expectedIndex,
    searchValue: ensureAppearsOnce,
  };
};

const shortListCase = generateLongSortedList(10);
console.log(shortListCase);
const longListCase = generateLongSortedList(100);
console.log(longListCase);
const longerListCase = generateLongSortedList(1000);
console.log(longerListCase);
const longestListCase = generateLongSortedList(10000);
console.log(longestListCase);

const testCases: Array<TestCase> = [
  {
    description: "empty",
    collection: [],
    expectedIndex: -1,
    searchValue: 0,
  },
  {
    description: "simple",
    collection: [0, 1, 2],
    expectedIndex: 0,
    searchValue: 0,
  },
  {
    description: "negative start",
    collection: [-2, -1, 0, 1, 2],
    expectedIndex: 2,
    searchValue: 0,
  },
  {
    description: "negative throughout",
    collection: [-5, -4, -3, -2, -1],
    expectedIndex: 3,
    searchValue: -2,
  },
  {
    description: "contains repeats",
    collection: [0, 0, 0, 1, 2, 2, 3, 4, 4, 5, 9, 9, 10, 15],
    expectedIndex: 9,
    searchValue: 5,
  },
  {
    description: "random list",
    ...shortListCase,
  },
  {
    description: "long, random list",
    ...longListCase,
  },
  {
    description: "very long, random list",
    ...longerListCase,
  },
  {
    description: "even longer, random list",
    ...longestListCase,
  },
];

describe("linear search", () => {
  for (const testCase of testCases) {
    it(`returns idx=${testCase.expectedIndex} for value=${testCase.searchValue}
       ${
         testCase.collection.length <= 10
           ? `in [${testCase.collection}] -`
           : "-"
       } ${testCase.description}`, () => {
      const idx: Index = linearSearch(
        testCase.collection,
        (element) => element === testCase.searchValue,
      );
      expect(idx).toEqual(testCase.expectedIndex);
    });
  }
});

describe("binary search", () => {
  for (const testCase of testCases) {
    const predicate = (element: number) => {
      if (testCase.searchValue > element) {
        return 1;
      }
      if (testCase.searchValue < element) {
        return -1;
      }
      return 0;
    };

    it(`returns idx=${testCase.expectedIndex} for value=${testCase.searchValue}
       ${
         testCase.collection.length <= 10
           ? `in [${testCase.collection}] -`
           : "-"
       } ${testCase.description}`, () => {
      const idx: Index = binarySearch<Array<number>, number>(
        testCase.collection,
        predicate,
      );
      expect(idx).toEqual(testCase.expectedIndex);
    });
  }
});
