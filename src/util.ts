// Defined for clarity (BDD)
export type Index = number;

export type Collection<ElementType> = Iterable<ElementType> &
  RelativeIndexable<ElementType> & { length: number };

export const deleteObjectProperties = (obj: object | undefined) => {
  for (const prop in obj) {
    delete obj[prop as keyof typeof obj];
  }
};

export function isSorted<ElementType>(collection: Collection<ElementType>) {
  if (collection.length <= 1) {
    return true;
  }
  for (let i = 1; i < collection.length; i++) {
    if (collection.at(i)! < collection.at(i - 1)!) {
      return false;
    }
  }
  return true;
}
