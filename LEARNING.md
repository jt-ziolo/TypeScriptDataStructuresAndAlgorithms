## JavaScript/TypeScript memory management and the delete keyword

1. Setting the value of a property to undefined is not the same as calling `delete` on that property.
2. `delete` is meant to be called on object properties, and it severs the reference between the object and the value of the property.
3. The garbage collector will only collect objects which have no references to any other objects.
4. In the situation that Object A is linked to Object B by a property (e.g. `A.prop = B`) and then you delete that property (`delete A.prop`), Object B is only guaranteed to be garbage collected if it lacks any references to other objects (if all of its properties are deleted).

## Linked Lists

- For this implementation, I set up my doubly linked list class in a particular way to make sure that there cannot be a node before the root node (either by the root node having a `previous` property or by other nodes accepting a root node as their `next` property). If I did not do that, then it would have been possible for the root node on the list object to be deleted via `removeAfter` while causing a memory leak, or for the root node to get out of sync with the start of the list.

## Hashing

- Even with a large base, collisions can still occur due to the pigeonhole principle: if you hash more strings than there are possible hash values, some strings must have the same hash value. This is true regardless of the hash function used.

## Divide and Conquer Algorithms

- When writing recursive algorithms, always check for possible infinite loops with collections of sizes 0 through 2.

## Floating Point Arithmetic and Radix Sort

- When attempting to get a chosen digit of an integer using math functions (division by a power of 10 followed by a floor or rounding operation, etc.), you may get incorrect results for certain input numbers due to floating point errors.
- JavaScript numbers are double-precision floating point numbers. While BigInt is available, it also has a memory tradeoff and would require a modulo-based approach.
- The easiest way to get the digit of a number (though not ideal from a performance perspective) is to convert the number to a string and then access the digit using the string indexer, parsing it back into an integer.
