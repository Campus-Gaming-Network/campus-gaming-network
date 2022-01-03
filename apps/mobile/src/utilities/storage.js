import * as SecureStore from "expo-secure-store";

export const saveStorageItem = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

export const getStorageItem = async (key) => {
  const result = await SecureStore.getItemAsync(key);

  if (result) {
    return result;
  }

  return undefined;
};

export const deleteStorageItem = async (key) => {
  await SecureStore.deleteItemAsync(key);
};
