import { rabinKarpSubstringSearch } from "./search-string";

// describe("hashing implementation", () => {
//   it("does not exceed safe integer storage size in JavaScript", () => {
//     let highValueSubstring: string = "";
//     for (let i = 0; i < 100; i++) {
//       highValueSubstring += "~";
//     }
//     const hash = getRabinFingerprintHash(highValueSubstring);
//     // console.log(`${hash}, or: 2^${Math.log2(hash)}`);
//     expect(Number.isSafeInteger(hash)).toBe(
//       true,
//     );
//   });
// });

describe("Rabin-Karp Substring Search", () => {
  it("finds no matches when the substring is absent", () => {
    const indices = rabinKarpSubstringSearch("There are no matches.", "happy");
    expect(indices.length).toBe(0);
  });
  it("is case sensitive", () => {
    const indices = rabinKarpSubstringSearch(
      "I learned bears love pears",
      "Ear",
    );
    expect(indices.length).toBe(0);
  });
  it("can match digits", () => {
    const indices = rabinKarpSubstringSearch("01234567", "34");
    expect(indices).toEqual([3]);
    expect(indices.length).toBe(1);
  });
  it("can match digits (mixed)", () => {
    const indices = rabinKarpSubstringSearch("Not strict1y 1337speak", "7sp");
    expect(indices).toEqual([16]);
    expect(indices.length).toBe(1);
  });
  it("can match special symbols", () => {
    const indices = rabinKarpSubstringSearch("!@#$*%@(#?", "*%");
    expect(indices).toEqual([4]);
    expect(indices.length).toBe(1);
  });
  it("can match special symbols (mixed)", () => {
    const indices = rabinKarpSubstringSearch("What's that, hm?", "hm?");
    expect(indices).toEqual([13]);
    expect(indices.length).toBe(1);
  });
  it("finds 1 match when the substring is only present once", () => {
    const indices = rabinKarpSubstringSearch("I spy something red.", "thing");
    expect(indices).toEqual([10]);
    expect(indices.length).toBe(1);
  });
  it("finds 3 matches when the substring is present three times", () => {
    const indices = rabinKarpSubstringSearch(
      "I learned bears love pears.",
      "ear",
    );
    expect(indices).toEqual([3, 11, 22]);
    expect(indices.length).toBe(3);
  });
  it("can match at the start of the string", () => {
    const indices = rabinKarpSubstringSearch("Hello goodbye.", "Hello");
    expect(indices).toEqual([0]);
    expect(indices.length).toBe(1);
  });
  it("can match at the end of the string", () => {
    const indices = rabinKarpSubstringSearch("Hello goodbye.", "bye.");
    expect(indices).toEqual([10]);
    expect(indices.length).toBe(1);
  });
  it("can match on a 1-character-long substring", () => {
    const indices = rabinKarpSubstringSearch("I spy something red.", "e");
    expect(indices).toEqual([9, 17]);
    expect(indices.length).toBe(2);
  });
});
