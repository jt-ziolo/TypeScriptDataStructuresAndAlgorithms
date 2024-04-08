import { randomInt } from "crypto";
import { getDigit, getNumberOfDigits, radixSort } from "./sort-radix";
import { baseSortAlgorithmTests } from "./sort-linear-collection.test";
import { Collection, arrayCopyToFunction } from "../util";

describe("getNumberOfDigits", () => {
  it("throws an error for non-positive integer input for the value arg", () => {
    expect(() => getNumberOfDigits(-100)).toThrow();
  });
  it("throws an error for non-integer input for the value arg", () => {
    expect(() => getNumberOfDigits(281.241)).toThrow();
  });
  it("returns 1 digit for 0", () => {
    expect(getNumberOfDigits(0)).toBe(1);
  });
  it("returns 1 digit for 1", () => {
    expect(getNumberOfDigits(1)).toBe(1);
  });
  it("returns 2 digits for 10", () => {
    expect(getNumberOfDigits(10)).toBe(2);
  });
  it("returns 3 digits for 100", () => {
    expect(getNumberOfDigits(100)).toBe(3);
  });
  it("returns 1 digit for other one-digit numbers", () => {
    const array = [2, 3, 4, 5, 6, 7, 8, 9];
    for (const i of array) {
      expect(getNumberOfDigits(i)).toBe(1);
    }
  });
  it("returns 2 digits for two-digit numbers", () => {
    for (let i = 0; i < 1000; i++) {
      const randomNum = (randomInt(9) + 1) * 10 + randomInt(10);
      expect(getNumberOfDigits(randomNum)).toBe(2);
    }
  });
  it("returns 3 digits for three-digit numbers", () => {
    for (let i = 0; i < 1000; i++) {
      const randomNum =
        (randomInt(9) + 1) * 100 + (randomInt(9) + 1) * 10 + randomInt(10);
      expect(getNumberOfDigits(randomNum)).toBe(3);
    }
  });
  it("returns the correct number of digits for many-digit numbers", () => {
    for (let i = 0; i < 1000; i++) {
      const numDigits = randomInt(10) + 4;
      let randomNum = randomInt(10);
      for (let j = 1; j < numDigits; j++) {
        randomNum += (randomInt(9) + 1) * 10 ** j;
      }
      expect(getNumberOfDigits(randomNum)).toBe(numDigits);
    }
  });
});

describe("getDigit", () => {
  it("throws an error for non-positive integer input for the value arg", () => {
    expect(() => getDigit(-1, 0)).toThrow();
  });
  it("throws an error for non-positive integer input for the fromRightIdx arg", () => {
    expect(() => getDigit(100, -1)).toThrow();
  });
  it("throws an error for non-integer input for the value arg", () => {
    expect(() => getDigit(4102.419, 1)).toThrow();
  });
  it("returns 0 as the 1st digit from the right for 0", () => {
    expect(getDigit(0, 0)).toBe(0);
  });
  it("returns 0 as the 1st digit from the right for 10", () => {
    expect(getDigit(10, 0)).toBe(0);
  });
  it("returns 1 as the 2nd digit from the right for 10", () => {
    expect(getDigit(10, 1)).toBe(1);
  });
  it("returns 7 and 8 as the 1st digit from the right for 37, 38", () => {
    expect(getDigit(37, 0)).toBe(7);
    expect(getDigit(38, 0)).toBe(8);
  });
  it("returns each digit from the right correctly for 123456789", () => {
    const number = 123456789;
    for (let i = 0; i < 9; i++) {
      expect(getDigit(number, i)).toBe(9 - i);
    }
  });
  it("returns 0 as the digit if the value has less digits than the requested digit", () => {
    expect(getDigit(123, 4)).toBe(0);
    expect(getDigit(1234, 4)).toBe(0);
    expect(getDigit(9999, 4)).toBe(0);
  });
});

baseSortAlgorithmTests(
  "radix sort",
  function (collection: Collection<number>) {
    radixSort(collection, arrayCopyToFunction);
  },
  false,
);

describe("radix sort (specific)", () => {
  it("uses the correct max number of digits", () => {
    // Arrange
    const initialArray = [1, 2, 3000, 4, 5];
    const array = structuredClone(initialArray);
    // Act
    radixSort(array, arrayCopyToFunction);
    // Assert
    expect(array).not.toStrictEqual(initialArray);
    expect(array).toStrictEqual([1, 2, 4, 5, 3000]);
  });
});
