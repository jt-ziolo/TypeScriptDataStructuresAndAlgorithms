# TypeScript Data Structures and Algorithms Exercise

Intended as a personal learning exercise to help knock off some rust with Algorithms, Data Structures, and Big O time/space complexity analysis while solidifying my knowledge of TypeScript and Mutation Testing (via [Stryker](https://stryker-mutator.io/docs/)). Work in progress.

## Data Structures

**Worst-Case Time Complexity**
| Data Structure | Access | Search | Insert | Remove |
|---|---|---|---|---|
| Singly Linked List | O(n) | O(n) | O(1)[^1] | O(1)[^2] |

[^1]: When a reference is available to a node which neighbors the insertion point.
[^2]: When a reference is available to the node being removed, or one of its neighbors.

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

- [ ] Queue
- [ ] Double-Ended Queue
- [ ] Fixed-Sized Queue (Circular Buffer implementation)
- [ ] Priority Queue
- [ ] Double-Ended Priority Queue
- [ ] Stack

### Linked List

- [x] (Singly) Linked List
- [ ] Doubly Linked List
- [ ] Skip List
- [ ] Blockchain

### Set

- [ ] Disjoint-Set
- [ ] Multiset

### Map

- [ ] Hash Table
- [ ] Multimap

## Algorithms

### Searching and Traversal

- [ ] Linear Search
- [ ] Binary Search
- [ ] Rabin-Karp Substring Search
- [ ] Depth-First Search on a Graph (recursive and iterative)
- [ ] Breadth-First Search on a Graph (recursive and iterative)
- [ ] Binary Search (Binary Search Tree)
- [ ] Binary Tree Traversal: In-Order, Post-Order, and Pre-Order

### Sorting

- [ ] Merge Sort
- [ ] Quick Sort
- [ ] Radix Sort
- [ ] Bubble Sort
- [ ] Selection Sort
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
