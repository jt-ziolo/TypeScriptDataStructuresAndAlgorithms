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
