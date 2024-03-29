export interface LinkedNode<T> {
  data: T;
  next?: LinkedNode<T>;
}

export class SinglyLinkedNode<T> implements LinkedNode<T> {
  data: T;
  next?: SinglyLinkedNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}

export class DoublyLinkedNode<T> implements LinkedNode<T> {
  data: T;
  previous?: DoublyLinkedNode<T>;
  next?: DoublyLinkedNode<T>;

  constructor(data: T) {
    this.data = data;
  }
}
