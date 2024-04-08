import { randomInt } from "crypto";
import { SkipList } from "./skip-list";

const probabilityFunctions = {
  half() {
    return randomInt(2) === 0;
  },
};

describe("skip list", () => {
  describe("constructor", () => {
    describe("no parameter passed in", () => {
      let list: SkipList<number>;
      beforeEach(() => {
        list = new SkipList<number>(probabilityFunctions.half);
      });
      it("does not assign a head", () => {
        expect(list.head).toBeUndefined();
      });
      it("returns zero length", () => {
        expect(list.length).toBe(0);
      });
    });
  });
});
