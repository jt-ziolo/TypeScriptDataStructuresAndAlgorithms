## JavaScript/TypeScript memory management and the delete keyword

1. Setting the value of a property to undefined is not the same as calling `delete` on that property.
2. `delete` is meant to be called on object properties, and it severs the reference between the object and the value of the property.
3. The garbage collector will only collect objects which have no references to any other objects.
4. In the situation that Object A is linked to Object B by a property (e.g. `A.prop = B`) and then you delete that property (`delete A.prop`), Object B is only guaranteed to be garbage collected if it lacks any references to other objects (if all of its properties are deleted).

## Linked Lists

- For this implementation, I set up my doubly linked list class in a particular way to make sure that there cannot be a node before the root node (either by the root node having a `previous` property or by other nodes accepting a root node as their `next` property). If I did not do that, then it would have been possible for the root node on the list object to be deleted via `removeAfter` while causing a memory leak, or for the root node to get out of sync with the start of the list.

## Skip List Operations

- In hindsight, you should go in thinking that each list operation (insert, remove, at, contains) will require a variant of the skip list traversal algorithm. The traversal method is what allows skip lists to be efficient (averaged time complexity).
- The length operation is more straightforward, and could be implemented with either a descent to the bottom layer followed by a count or by maintaining a count in an instance variable.
- Nodes that were descended from during the insertion operation should be tracked for use during randomized promotion.
- Skip list traversal should proceed from the "top left" to the "bottom right", or from the head node to the end of the bottommost layer. Traversal should occur across the row/layer first, descending only when necessary.
- Skip list operations have a wide variety of edge cases; especially when implementing indexed skip lists. Multiple examples should be written out and worked through to determine the correct ways to implement operations while updating link widths.

## Hashing

- Even with a large base, collisions can still occur due to the pigeonhole principle: if you hash more strings than there are possible hash values, some strings must have the same hash value. This is true regardless of the hash function used.

## Divide and Conquer Algorithms

- When writing recursive algorithms, always check for possible infinite loops with collections of sizes 0 through 2.

## Floating Point Arithmetic and Radix Sort

- When attempting to get a chosen digit of an integer using math functions (division by a power of 10 followed by a floor or rounding operation, etc.), you may get incorrect results for certain input numbers due to floating point errors.
- JavaScript numbers are double-precision floating point numbers. While BigInt is available, it also has a memory tradeoff and would require a modulo-based approach.
- The easiest way to get the digit of a number (though not ideal from a performance perspective) is to convert the number to a string and then access the digit using the string indexer, parsing it back into an integer.

## For Loop Additional Initialization

- If additional initialized assignments are needed in a for loop (for example, setting the length of a string to be compared against the index in the condition step), you can specify those assignments in comma-separated format prior to the semicolon.

```ts
// Definition
for (initialization; condition; afterthought) {
    statement;
}

// The following examples are all valid javascript
for (let i = 0, len = str.length; i < len; i++) {
    // ...
}

for (let i = 0; i < 10; i++) {
    // ...
}

for (let i = 0; ; i++) {
    if(i >= 10) {
        break;
    }
}

let iTimesJ = 0;
for (let i = 0; i < 10; i++, j++, iTimesJ = i * j);
```
