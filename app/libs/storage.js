// import AsyncStorage from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-community/async-storage";

const set = async (key, value) => {
  if (value !== undefined) { // có thể lưu giá trị false và 0
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
};

const get = async (key) => {
  // return undefined;

  const value = await AsyncStorage.getItem(key);
  if (value) return JSON.parse(value);
  return undefined;
};

const remove = (key) => AsyncStorage.removeItem(key);

const clear = () => AsyncStorage.clear();

export default {
  set,
  get,
  remove,
  clear,
};
