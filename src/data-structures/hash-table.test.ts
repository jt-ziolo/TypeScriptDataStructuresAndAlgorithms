import { randomInt } from "crypto";
import { HashTable, hash } from "./hash-table";
import { KeyNotFoundError } from "../error";

describe("hash table", () => {
  let table: HashTable<string, number>;
  beforeEach(() => {
    table = new HashTable<string, number>(1000);
  });
  describe("hash function", () => {
    it("generates a unique hash across simple inputs", () => {
      const cases = [
        "hello",
        "goodbye",
        253,
        "red",
        BigInt(20),
        0b101,
        true,
        false,
      ];
      const setOfHashes: Set<number> = new Set();
      for (const input of cases) {
        expect(setOfHashes.has(hash(input))).toBe(false);
        setOfHashes.add(hash(input));
      }
    });
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
    it("should overwrite values when specified to do so", () => {
      table.set("example", 100);
      expect(table.get("example")).toBe(100);
      table.set("example", 987, true);
      expect(table.get("example")).toBe(987);
    });
  });
  describe("get", () => {
    it("should throw a KeyNotFoundError when called on a key that does not exist in the table", () => {
      expect(() => table.get("example")).toThrow(KeyNotFoundError);
    });
    it("should get values correctly in a completely filled table", () => {
      // Preserved below: code used to find keys that do not result in hash
      // collisions for a table of size 10
      /*
      const smallerTable = new HashTable<string, number>(10);
      const uniqueIndexEntries: Set<number> = new Set();
      while (uniqueIndexEntries.size < 10) {
        const randomStr = randomInt(99999).toString();
        const index = hash(randomStr) % 10;
        if (!uniqueIndexEntries.has(index)) {
          smallerTable.set(randomStr, uniqueIndexEntries.size);
          uniqueIndexEntries.add(index);
        }
      }
      console.log(smallerTable.toString());
      */
      // Result:
      // 3302 47703 78241 10895 23757 88829 35396 55728 56449 18811
      const nonCollidingKeys = [
        "3302",
        "47703",
        "78241",
        "10895",
        "23757",
        "88829",
        "35396",
        "55728",
        "56449",
        "18811",
      ];
      const smallerTable = new HashTable<string, number>(10);
      for (let i = 0; i < 10; i++) {
        smallerTable.set(nonCollidingKeys.at(i)!, i * 2);
      }
      for (let i = 0; i < 10; i++) {
        expect(smallerTable.get(nonCollidingKeys.at(i)!)).toBe(i * 2);
      }
    });
  });
  describe("delete", () => {
    it("should throw a KeyNotFoundError when called on an empty table, when specified", () => {
      expect(() => table.delete("something", true)).toThrow(KeyNotFoundError);
    });
    it("should not throw a KeyNotFoundError when called on an empty table, when specified", () => {
      expect(() => table.delete("something", false)).not.toThrow(
        KeyNotFoundError,
      );
    });
    it("should not alter the table if the key is not found", () => {
      const smallTable = new HashTable<string, number>(5);
      smallTable.set("a", 0);
      smallTable.set("b", 1);
      smallTable.set("c", 2);
      smallTable.set("d", 3);
      const originalStr = smallTable.toString();
      smallTable.delete("something", false);
      expect(smallTable.toString()).toStrictEqual(originalStr);
    });
    it("should successfully delete an entry in the table (no collisions)", () => {
      table.set("a", 0);
      table.set("b", 1);
      table.set("c", 2);
      table.set("d", 3);
      expect(table.get("b")).toBe(1);
      table.delete("b", true);
      expect(() => table.get("b")).toThrow(KeyNotFoundError);
    });
    it("should successfully delete an entry in a table with many collisions without affecting access to the remaining members", () => {
      const smallerTable = new HashTable<string, number>(10);
      const deletedMemberKeys: Set<string> = new Set();
      for (let i = 0; i < 50; i++) {
        smallerTable.set(`entry${i}`, i * 2);
        if (randomInt(3) === 0) {
          // 1/3 chance
          deletedMemberKeys.add(`entry${i}`);
        }
      }
      for (const key of deletedMemberKeys) {
        smallerTable.delete(key, true);
      }
      for (let i = 0; i < 50; i++) {
        if (deletedMemberKeys.has(`entry${i}`)) {
          continue;
        }
        expect(smallerTable.get(`entry${i}`)).toBe(i * 2);
      }
    });
  });
  it("should be capable of storing two entries with colliding hashes and it should resolve the collision", () => {
    const stringA = "Aa";
    const stringB = "BB";
    expect(hash(stringA)).toStrictEqual(hash(stringB));
    table.set(stringA, 123);
    table.set(stringB, 987);
    expect(table.get(stringA)).toBe(123);
    expect(table.get(stringB)).toBe(987);
  });
  it("should be capable of resolving many colliding hashes", () => {
    // With a table size of 10 and 20 elements to store, there are guaranteed
    // to be collisions (pigeonhole principle - the index is generated from the
    // hash using `mod length`)
    const smallerTable = new HashTable<string, number>(10);
    for (let i = 0; i < 20; i++) {
      smallerTable.set(`entry${i}`, i * 2);
    }
    for (let i = 0; i < 20; i++) {
      expect(smallerTable.get(`entry${i}`)).toBe(i * 2);
    }
  });
});
