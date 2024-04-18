## JavaScript/TypeScript toString overrides in custom classes

- In order for toString overrides to appear in jest tests and `console.log(...)` calls, the `get [Symbol.toStringTag]() {...}` getter should be implemented.
- Implementing `public toString: string() {...}` does not work in many cases.
- When using Jest's `it.each(...)(name, fn, timeout)` test approach, the `name` argument is parsed using [printf formatting](https://jestjs.io/docs/api#1-describeeachtablename-fn-timeout). To show the output of the `get [Symbol.toStringTag]() {...}` getter, `%s` should be substituted into the `name` argument (not `%p`).

## JavaScript/TypeScript Special Types null, undefined, NaN, infinity values

### Undefined vs. Null

- In JS/TS, `undefined` is the default type and value when an argument is not passed to an optional parameter. I chose to replace  the typical `null` checking I'd perform when coding in other languages with checks against `undefined` for this reason.
- Following the [MDN definition](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/null), I chose to use `null` only when I needed to indicate the deliberate absence of a value (which is rare). Unlike `undefined`, type checking prevents `null` from appearing as an argument in a function call unless it is explicitly allowed.

### Not-A-Number (NaN)

- When performing numeric calculations and comparisons with variables that may be undefined, extra care needs to be taken to check that the value is neither `undefined` nor `NaN`. When a numeric calculation fails to evaluate to a number, `NaN` is returned instead of `undefined`. Unfortunately, `NaN` cannot be compared to `undefined` and `(variable with value NaN) === undefined` will evaluate to false. `x === undefined`, `isNaN(x)`, and `Number.isNaN(x)` will all fail in one way or another to detect that `x` is either `undefined` or `NaN`; instead, `isNaN(Number(x))` must be used.

### Infinity and -Infinity

- `isNaN(Number(x))` will return `false` for `x === Infinity` and `x === -Infinity`. In contexts where infinity and negative infinity are possible values from a calculation (`(non-zero number) / 0`, `log(0)`, extremely large numbers), you can check that `x !== Infinity && x !== -Infinity && !isNaN(x)` using `Number.isFinite(x)` (note, this is not the same as `Number.isFinite(Number(x))` in TypeScript).
- `Number.isFinite(Number(x))` covers everything, checking that `x` is not `Infinity`, `-Infinity`, `undefined`, and `NaN`.
- In the context that you are storing `number | undefined` in some variable, and would like the sum of that variable and a number to equal `undefined` if the variable is already `undefined`, it's possible to simplify the expression and remove the need for an `undefined` check by using `Infinity` instead, since `Infinity + (any finite number) === Infinity`. However, it may not be immediately obvious to other programmers what you are doing.

### My Approach

For cases where I need to enforce that a number `x` is neither `undefined` nor `NaN`, I'm opting to use `Number.isFinite(Number(x))`, unless `Infinity` and `-Infinity` are explicitly allowed, in which case I will use `!isNaN(Number(x))`. For the purpose of maintaining clean, readable, and maintainable code, I have implemented these checks into utility functions with better names.

## JavaScript/TypeScript memory management and the delete keyword

1. Setting the value of a property to undefined is not the same as calling `delete` on that property.
2. `delete` is meant to be called on object properties, and it severs the reference between the object and the value of the property.
3. The garbage collector will only collect objects which have no references to any other objects.
4. In the situation that Object A is linked to Object B by a property (e.g. `A.prop = B`) and then you delete that property (`delete A.prop`), Object B is only guaranteed to be garbage collected if it lacks any references to other objects (if all of its properties are deleted).

## Setting up StrykerJS with Jest and TypeScript

- In TypeScript projects, StrykerJS will not detect TypeScript compilation errors and will erroneously show mutants that do not actually survive compilation unless the [Stryker TypeScript Checker plugin](https://stryker-mutator.io/docs/stryker-js/typescript-checker/) is installed.
- StrykerJS seems to be more likely to report false mutants when Jest's `it.each()` testing method is used. (#TODO)

## Jest Tests

- Prefer the `it.each(...)` approach for multiple test cases with the same format (shared "arrange/act/assert" steps). When using this approach, avoid putting the test cases into separate objects and referencing them. Doing so requires additional type checking and seems to reduce the test code's maintainability, all while not providing much benefit over specifying the test cases within the `each` call.

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
