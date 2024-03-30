import { Index, linearSearch } from "./linear-collections";

type TestCase = {
  description: string;
  collection: Array<number>;
  searchValue: number;
  expectedIndex: Index;
};

const sortedTestCases: Array<TestCase> = [
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
];

describe("linear search", () => {
  for (const testCase of sortedTestCases) {
    it(`returns idx=${testCase.expectedIndex} for value=${testCase.searchValue} ${testCase.collection.length <= 10 ? `in [${testCase.collection}] -` : "-"} ${testCase.description}`, () => {
      const idx: Index = linearSearch(
        testCase.collection,
        (element) => element === testCase.searchValue,
      );
      expect(idx).toEqual(testCase.expectedIndex);
    });
  }
});
