import { deleteObjectProperties } from "./util";

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
