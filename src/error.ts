// Stryker disable all

export class ExpectedPositiveIntegerError extends Error {
  constructor(receivedValue: number) {
    super(
      `Expected a positive integer value, but received "${receivedValue}".`,
    );
    this.name = "ExpectedPositiveIntegerError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class KeyNotFoundError extends Error {
  constructor(key: unknown) {
    super(`Key not found: "${key}".`);
    this.name = "KeyNotFoundError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class OutOfBoundsError extends Error {
  constructor(index: number, length: number) {
    super(`Index (${index}) exceeds the length of the collection (${length}).`);
    this.name = "OutOfBoundsError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export class MissingIndexError extends Error {
  // This error indicates either a mistake in the skip list implementation, or
  // a mistake made while attempting to manipulate the skip list structure
  // node-by-node (not recommended)
  constructor(index: number) {
    super(`Skip list is not formed correctly, lacks index: ${index}.`);
    this.name = "MissingIndexError";
    Error.captureStackTrace(this, this.constructor);
  }
}
