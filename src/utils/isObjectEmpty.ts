export const isObjectEmpty = (obj: object | null | undefined) => {
  if (obj === null || obj === undefined) {
    return true;
  }
  return Object.keys(obj).length === 0;
};
