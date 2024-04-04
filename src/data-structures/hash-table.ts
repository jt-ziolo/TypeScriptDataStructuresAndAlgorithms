import { KeyNotFoundError } from "../error";
import { SinglyLinkedList, SinglyLinkedNode } from "./singly-linked-list";

interface StringConvertible {
  toString: () => string;
}

// JavaScript implementation of Java string hash function
// Source: https://stackoverflow.com/a/8831937
export const hash = (item: StringConvertible) => {
  const str = item.toString();
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const charCode = str.charCodeAt(i);
    // Bitwise left shift
    // Stryker disable next-line ArithmeticOperator: hashing algorithm detail, not critical
    hash = (hash << 5) - hash + charCode;
    // Convert to 32bit integer using bitwise OR assignment
    hash |= 0;
  }
  return hash;
};

/* Hash Table: data structure which stores key-value pairs using a hash
 * function, allowing for highly efficient retrieval of values using their key.
 */
export class HashTable<KeyType extends StringConvertible, ValueType> {
  #array: Array<SinglyLinkedList<[KeyType, ValueType]>>;
  #size: number;

  constructor(
    size: number,
    initialKeyValuePairs?: Iterable<[KeyType, ValueType]>,
  ) {
    this.#size = size;
    // Stryker disable next-line ArrayDeclaration: optimization
    this.#array = new Array<SinglyLinkedList<[KeyType, ValueType]>>(size);
    if (initialKeyValuePairs === undefined) {
      return;
    }
    for (const pair of initialKeyValuePairs) {
      this.set(pair[0], pair[1]);
    }
  }

  get(key: KeyType) {
    const index = hash(key) % this.#size;
    const list = this.#array[index];
    if (list === undefined) {
      throw new KeyNotFoundError(key);
    }
    for (let node = list.root; node !== undefined; node = node.next) {
      if (node.data[0] === key) {
        return node.data[1];
      }
    }
    throw new KeyNotFoundError(key);
  }

  set(key: KeyType, value: ValueType, allowOverwrite = true) {
    const index = hash(key) % this.#size;
    if (this.#array[index] === undefined) {
      this.#array[index] = new SinglyLinkedList<[KeyType, ValueType]>();
    }
    const list = this.#array[index];
    // check if the list already includes the key being stored and overwrite
    // the value if so
    for (let node = list.root; node !== undefined; node = node.next) {
      if (node.data[0] === key) {
        if (!allowOverwrite) {
          return;
        }
        node.data[1] = value;
        return;
      }
    }
    list.insertBeginning(new SinglyLinkedNode([key, value]));
  }

  delete(key: KeyType, throwIfNotFound = true) {
    const index = hash(key) % this.#size;
    if (this.#array[index] === undefined) {
      if (throwIfNotFound) {
        throw new KeyNotFoundError(key);
      }
      return;
    }
    const list = this.#array[index];
    // check if the list includes the key being stored and delete the list node
    // if so
    for (let node = list.root; node !== undefined; ) {
      if (node === list.root && node.data[0] === key) {
        list.removeBeginning();
        return;
      }
      const nextNode = node.next;
      if (nextNode?.data[0] === key) {
        list.removeAfter(node);
        return;
      }
      node = nextNode;
    }
    if (throwIfNotFound) {
      throw new KeyNotFoundError(key);
    }
  }

  // TODO: needs to be called specifically, won't be inferred
  public toString(): string {
    return this.#array.toString();
  }
}
