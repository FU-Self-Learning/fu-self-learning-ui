export const getStorageData = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

export const toStoredData = (data: unknown) => JSON.stringify(data);

export const setStorageData = (key: string, data: unknown) => {
  if (typeof window === "undefined") return null;
  return localStorage.setItem(key, toStoredData(data));
};

export const removeStorageData = (key: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.removeItem(key);
};
