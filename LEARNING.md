## JavaScript/TypeScript memory management and the delete keyword

1. Setting the value of a property to undefined is not the same as calling `delete` on that property.
2. `delete` is meant to be called on object properties, and it severs the reference between the object and the value of the property.
3. The garbage collector will only collect objects which have no references to any other objects.
4. In the situation that Object A is linked to Object B by a property (e.g. `A.prop = B`) and then you delete that property (`delete A.prop`), Object B is only guaranteed to be garbage collected if it lacks any references to other objects (if all of its properties are deleted).

## Linked Lists

- For this implementation, I set up my doubly linked list class in a particular way to make sure that there cannot be a node before the root node (either by the root node having a `previous` property or by other nodes accepting a root node as their `next` property). If I did not do that, then it would have been possible for the root node on the list object to be deleted via `removeAfter` while causing a memory leak, or for the root node to get out of sync with the start of the list.
