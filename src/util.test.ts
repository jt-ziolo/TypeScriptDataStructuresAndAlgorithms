import {
  IsValidFiniteNumber,
  deleteObjectProperties,
  isDefinedAndNotNaN,
  isSorted,
} from "./util";

describe("deleteObjectProperties", () => {
  it("successfully deletes all object properties", () => {
    // Arrange
    const obj = {
      a: "hello",
      b: 5,
      c: true,
      d() {
        return "example A";
      },
      e: () => {
        return "example B";
      },
    };

    // Act
    deleteObjectProperties(obj);

    // Assert
    expect(obj).not.toHaveProperty("a");
    expect(obj).not.toHaveProperty("b");
    expect(obj).not.toHaveProperty("c");
    expect(obj).not.toHaveProperty("d");
    expect(obj).not.toHaveProperty("e");
  });

  it("does not throw if object is undefined", () => {
    const obj = undefined;
    expect(() => {
      deleteObjectProperties(obj);
    }).not.toThrow();
  });
});

describe("isSorted", () => {
  it("returns true for a collection of size 0", () => {
    expect(isSorted([])).toBe(true);
  });
  it("returns true for a collection of size 1", () => {
    expect(isSorted([123])).toBe(true);
  });
});

describe("undefined/NaN detection", () => {
  it("should return true for NaN", () => {
    expect(IsValidFiniteNumber(NaN)).toBe(false);
  });
  it("should return true for undefined", () => {
    expect(IsValidFiniteNumber(undefined)).toBe(false);
  });
  it("should return true for infinity", () => {
    expect(IsValidFiniteNumber(Infinity)).toBe(false);
  });
  it("should return true for negative infinity", () => {
    expect(IsValidFiniteNumber(-Infinity)).toBe(false);
  });
  it("should return false for a defined number", () => {
    expect(IsValidFiniteNumber(5)).toBe(true);
  });
  describe("isDefinedAndNotNaN", () => {
    it("should return false if the input is undefined", () => {
      const undefinedExample = undefined;
      expect(isDefinedAndNotNaN(undefinedExample)).toBe(false);
    });
    it("should return false if the input is NaN (with type number)", () => {
      const notANumber: number = NaN;
      const undefinedExample: number | undefined = undefined;
      expect(isDefinedAndNotNaN(notANumber)).toBe(false);
      expect(isDefinedAndNotNaN(undefinedExample! + 50)).toBe(false);
    });
    it.each([Infinity, -Infinity])(
      "should return true if the input number is Infinity or -Infinity",
      (input) => {
        expect(isDefinedAndNotNaN(input)).toBe(true);
      },
    );
    it.each([
      "hello",
      "",
      "undefined",
      "NaN",
      new Set(),
      new Map(),
      {},
      [1, 2, 3],
    ])("should return true for a variety of defined non-numbers", (input) => {
      expect(isDefinedAndNotNaN(input)).toBe(true);
    });
    it.each([
      0,
      -0,
      100,
      -100,
      Math.E,
      Math.PI,
      Number.MAX_VALUE,
      Number.MIN_VALUE,
    ])(
      "should return true for a variety of defined numbers, rational or irrational",
      (input) => {
        expect(isDefinedAndNotNaN(input)).toBe(true);
      },
    );
  });
});
