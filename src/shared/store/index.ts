const isClient = typeof window !== "undefined";

export const fromStoredData = (storageData: any) => {
  try {
    return JSON.parse(storageData);
  } catch {
    return storageData;
  }
};

export const toStoredData = (data: any) => {
  if (typeof data === "string") {
    return data;
  }
  return JSON.stringify(data);
};

export const getStorageData = (key: any) => {
  if (!isClient) return null;
  const storedData = localStorage.getItem(key);
  return storedData ? fromStoredData(storedData) : null;
};

export const setStorageData = (key: any, data: any) => {
  if (!isClient) return;
  localStorage.setItem(key, toStoredData(data));
};

export const removeStorageData = (key: any) => {
  if (!isClient) return;
  localStorage.removeItem(key);
};
