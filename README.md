# TypeScript Data Structures and Algorithms Exercise

Intended as a personal learning exercise to help knock off some rust with Algorithms, Data Structures, and Big O time/space complexity analysis while solidifying my knowledge of TypeScript and Mutation Testing (via [Stryker](https://stryker-mutator.io/docs/)). Work in progress.

## Data Structures

_Note:_ Certain data structures (e.g. Queues and Stacks) are implemented using JavaScript's array type (`Array<>` in TypeScript), which is implemented as a dynamic array.

**Worst-Case Time Complexity**
| Data Structure | Access | Search | Insert | Remove |
|---|---|---|---|---|
| Linked List[^1] | O(n) | O(n) | O(1) | O(1) |
| Array | O(1) | O(n) | O(n) | O(n) |

[^1]: Insert and remove operations are evaluated separately from the search operation.

**Expected-Case Time Complexity**
(for those data structures where it differs from the worst-case)
| Data Structure | Access | Search | Insert | Remove |
|---|---|---|---|---|
|   |   |   |   |   |

**Worst-Case Space Complexity**
(for data structures where it is a notable, distinguishing characteristic)
| Data Structure | Access | Search | Insert | Remove |
|---|---|---|---|---|
|   |   |   |   |   |

### Time Complexity of Stacks and Queues

Stacks and queues are implemented using either JavaScript arrays or Singly Linked Lists. In both cases, the time complexity of the stack and queue operations (`push`, `pop`, `top`/`first` aka peek, `add` aka enqueue, `remove` aka dequeue, `isEmpty`, `length`) are O(1). A counting technique is used across relevant implementations to achieve a `length` method that runs in O(1) time.

There is marginally more memory used in the array implementations compared to the Singly Linked List implementations, because some array space is reserved during insertion operations since JavaScript arrays are dynamic arrays. However, the array implementations may perform better than the linked list implementations for certain hardware setups due to their contiguous memory structure, especially when vast numbers of elements are stored and processed in a complex program while the machine is under significant load.

## Todo List

### Graph, Tree, and Heap

- [ ] Weighted Graph (Adjacency List and Adjacency Matrix implementations)
- [ ] Tree
- [ ] Trie
- [ ] B-Tree
- [ ] Binary Tree
- [ ] Red-Black Tree
- [ ] AVL Tree
- [ ] Binary Heap

### Queue and Stack

- [x] Queue
- [ ] Double-Ended Queue
- [ ] Fixed-Sized Queue (Circular Buffer implementation)
- [ ] Priority Queue
- [ ] Double-Ended Priority Queue
- [x] Stack

### Linked List

- [x] (Singly) Linked List
- [x] Doubly Linked List
- [ ] Indexable Skip List

### Set

- [ ] Disjoint-Set
- [ ] Multiset

### Map

- [ ] Hash Table
- [ ] Multimap

## Algorithms

**Time Complexity**
| Algorithm | Best-Case | Expected-Case | Worst-Case |
|---|---|---|---|
| Linear Search | O(1) | O(n) | O(n) |
| Binary Search | O(1) | O(log(n)) | O(log(n)) |
| Rabin-Karp Substring Search[^2] | O(s+b) | - | O(s\*b) |
| Insertion Sort | O(n^2) | - | O(n^2) |
| Bubble Sort | O(n^2) | - | O(n^2) |
| Merge Sort | O(n\*log(n)) | - | O(n\*log(n)) |
| Radix Sort[^3] | O(k\*n) | - | O(k\*n) |

[^2]: Where `s` is the length of the substring, and `b` is the length of the base or source string.
[^3]: Where `k` is the number of digits (for numbers; more generally it's the length of whatever quantity you are sorting), and `n` is the number of elements.

### Searching and Traversal

- [x] Linear Search
- [x] Binary Search
- [x] Rabin-Karp Substring Search
- [ ] Depth-First Search on a Graph (recursive and iterative)
- [ ] Breadth-First Search on a Graph (recursive and iterative)
- [ ] Binary Search (Binary Search Tree)
- [ ] Binary Tree Traversal: In-Order, Post-Order, and Pre-Order

### Sorting

- [x] Merge Sort
- [ ] Quick Sort
- [x] Radix Sort
- [x] Bubble Sort
- [x] Selection Sort
- [ ] Heap Sort
- [ ] External Sort (of large collections using Double Ended Priority Queue)
- [ ] Topological Sort of a Directed Graph: Kahn's Algorithm

### Shortest Path Optimization and Path Finding

- [ ] Christofides Algorithm
- [ ] Dijkstra's Algorithm
- [ ] A* Algorithm
- [ ] Bellman-Ford Algorithm
- [ ] Floyd-Warshall Algorithm
- [ ] Minimum Spanning Forest: Kruskal's Algorithm
