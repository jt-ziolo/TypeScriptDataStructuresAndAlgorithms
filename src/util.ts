export const deleteObjectProperties = (obj: object | undefined) => {
  for (const prop in obj) {
    delete obj[prop as keyof typeof obj];
  }
};
