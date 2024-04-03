/* Queue: A first-in-first-out (FIFO) collection interface implemented using an array.
 *   - add(item) (aka enqueue): add an item to the end of the queue
 *   - remove() (aka dequeue): remove the first item in the queue and return it
 *   - first (aka peek) getter: return the first item in the queue without removing it
 *   - isEmpty getter: return true iff the queue is empty
 *   - length getter: return the length of (number of elements within) the queue
 */
export class Queue<ElementType> {
  #array: Array<ElementType> = [];

  constructor(iterable?: Iterable<ElementType>) {
    if (iterable) {
      this.#array = Array.from(iterable);
    }
  }

  add(item: ElementType) {
    this.#array.push(item);
  }
  remove() {
    return this.#array.shift();
  }
  get first() {
    return this.#array.at(0);
  }
  get isEmpty() {
    return this.#array.length === 0;
  }
  get length() {
    return this.#array.length;
  }
}
