import { HashTable } from "./hash-table";

describe("hash table", () => {
  let table: HashTable<string, number>;
  beforeEach(() => {
    table = new HashTable<string, number>(1000);
  });
  describe("set", () => {
    it('should be capable of storing using an "empty" key', () => {
      table.set("", 1234);
      expect(table.get("")).toBe(1234);
    });
    it("should not overwrite values if prohibited from doing so", () => {
      table.set("example", 100);
      expect(table.get("example")).toBe(100);
      table.set("example", -987, false);
      expect(table.get("example")).toBe(100);
    });
  });
  describe.skip("get", () => {});
  describe.skip("delete", () => {});
});
