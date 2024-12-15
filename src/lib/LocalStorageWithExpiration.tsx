const DEFAULT_EXPIRATION_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

// Function to store data with an expiration time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setItemWithExpiration = (key: string, value: any, expirationTime: number = DEFAULT_EXPIRATION_TIME): void => {
  const expirationDate = new Date().getTime() + expirationTime;
  const item = {
    value,
    expiration: expirationDate,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

// Function to get data from localStorage with expiration check
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getItemWithExpiration = (key: string): any | null => {
  const storedItem = localStorage.getItem(key);
  if (!storedItem) {
    return null;
  }

  const parsedItem = JSON.parse(storedItem);
  const { value, expiration } = parsedItem;

  // If the item is expired, remove it and return null
  if (new Date().getTime() > expiration) {
    localStorage.removeItem(key);
    return null;
  }

  return value; // Return the stored value if not expired
};

// Function to remove an item from localStorage
export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

// Function to clear all items from localStorage
export const clearAll = (): void => {
  localStorage.clear();
};
