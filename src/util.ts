// Defined for clarity (BDD)
export type Index = number;

export type Collection<ElementType> = Iterable<ElementType> &
  RelativeIndexable<ElementType> & { length: number };

export const deleteObjectProperties = (obj: object | undefined) => {
  for (const prop in obj) {
    delete obj[prop as keyof typeof obj];
  }
};
