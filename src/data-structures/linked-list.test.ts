import LinkedList = require("./linked-list");

describe("singly linked list", () => {
  test("linked list node data is accessible", () => {
    const listNode = new LinkedList.Node<string>("Example");
    expect(listNode.data).toBe("Example");
  });
  test("linked list nodes can be connected and traversed", () => {
    const root = new LinkedList.Node<number>(0);
    let last: LinkedList.Node<number> | undefined = undefined;
    for (let i = 0; i < 10; i++) {
      const next = new LinkedList.Node<number>(i + 1);
      if (i == 0) {
        root.child = next;
        last = next;
        continue;
      }
      last!.child = next;
      last = next;
    }
    expect(root.data).toBe(0);
    last = root;
    let count = 0;
    while (last.child !== undefined) {
      expect(last.data).toBe(count);
      last = last.child!;
      count += 1;
    }
    expect(count).toBe(10);
  });
  test("constructor successfully assigns root node when one is provided", () => {
    const root = new LinkedList.Node<number>(10);
    const list = new LinkedList.List<number>(root);
    expect(list.length).not.toBe(0);
    expect(list.length).toBe(1);
    expect(list.root).toBe(root);
  });
  test("empty linked list returns a length of zero", () => {
    const list = new LinkedList.List();
    expect(list.length).toBe(0);
  });
  test("empty linked list is not iterable", () => {
    const list = new LinkedList.List();
    let count = 0;
    for (const _ of list) {
      count += 1;
    }
    expect(count).toBe(0);
  });
  test("insertBeginning sets newRoot as the root for an empty linked list", () => {
    const list = new LinkedList.List<number>();

    expect(list.root).toBeUndefined();
    expect(list.length).toBe(0);

    list.insertBeginning(new LinkedList.Node<number>(0));

    expect(list.root).not.toBeUndefined();
    expect(list.root!.data).toBe(0);
    expect(list.length).toBe(1);
  });
  describe("with 3 elements", () => {
    let list: LinkedList.List<number> | undefined;
    beforeEach(() => {
      list = new LinkedList.List<number>();
      list.insertBeginning(new LinkedList.Node<number>(1));
      let last = list.root!;
      for (let i = 0; i < 2; i++) {
        const next = new LinkedList.Node<number>(i + 1);
        last.child = next;
        last = next;
      }
    });
    test("linked list length is correct", () => {
      expect(list!.length).toBe(3);
    });
    test("insertAfter places newNode in correct position", () => {
      LinkedList.List.insertAfter(
        // @ts-expect-error test setup ensures not undef
        list.root.child,
        new LinkedList.Node<number>(400),
      );
      // @ts-expect-error test setup ensures not undef
      expect(list.root.child.child.data).toBe(400);
    });
    test("insertBeginning places newRoot in correct position", () => {
      // @ts-expect-error test setup ensures not undef
      const oldRoot = list.root;
      // @ts-expect-error test setup ensures not undef
      list.insertBeginning(new LinkedList.Node<number>(400));
      // @ts-expect-error test setup ensures not undef
      expect(list.root.child).toBe(oldRoot);
    });
    test("insertBeginning sets newRoot's child to old root", () => {
      // @ts-expect-error test setup ensures not undef
      list.insertBeginning(new LinkedList.Node<number>(400));
      // @ts-expect-error test setup ensures not undef
      expect(list.root.data).toBe(400);
    });
  });
  describe("with many elements", () => {
    const list = new LinkedList.List<number>();
    beforeAll(() => {
      list.insertBeginning(new LinkedList.Node<number>(-1));
      let last = list.root!;
      for (let i = 0; i < 999; i++) {
        const next = new LinkedList.Node<number>(i + 1);
        last.child = next;
        last = next;
      }
    });
    test("linked list length is correct", () => {
      expect(list.length).toBe(1000);
    });
    test("can iterate through list", () => {
      const lastFiveItemsData = [];
      for (const item of list) {
        lastFiveItemsData.unshift(item?.data);
        if (lastFiveItemsData.length > 5) {
          lastFiveItemsData.pop();
        }
      }
      expect(lastFiveItemsData).toEqual([999, 998, 997, 996, 995]);
    });
  });
});
