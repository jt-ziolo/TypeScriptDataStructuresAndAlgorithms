// Defined for clarity (BDD)
export type Index = number;

export interface HasLength {
  get length(): number;
}

export type Collection<ElementType> = Iterable<ElementType> &
  RelativeIndexable<ElementType> &
  HasLength;

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

export const arrayCopyToFunction: CollectionCopyToFunction<number> = (
  fromCollection: Collection<number>,
  toCollection: Collection<number>,
  fromIndex: Index,
  toIndex: Index,
) => {
  const fromArray = fromCollection as Array<number>;
  const toArray = toCollection as Array<number>;
  toArray[toIndex] = fromArray[fromIndex];
};

export const arrayEmptyConstructor: CollectionConstructor<number> = (
  length: number,
) => {
  return Array.from<number>({ length: length });
};

export type CollectionSwapFunction<ElementType> = (
  collection: Collection<ElementType>,
  fromIndex: Index,
  toIndex: Index,
) => void;

export type CollectionCopyToFunction<ElementType> = (
  fromCollection: Collection<ElementType>,
  toCollection: Collection<ElementType>,
  fromIndex: Index,
  toIndex: Index,
) => void;

export type CollectionConstructor<ElementType> = (
  length: number,
) => Collection<ElementType>;
