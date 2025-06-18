import AsyncStorage from "@react-native-community/async-storage";

module.exports = {
  KEY_USER_LOGIN_STATUS: "@USER_LOGIN_STATUS",
  KEY_FCM_TOKEN: "@FCM_TOKEN",

  async insert(key, data, callback) {
    if (data) {
      await AsyncStorage.setItem(key, JSON.stringify(data));
      callback();
    } else {
      callback();
    }
  },

  async merge(key, data, callback) {
    if (data) {
      await AsyncStorage.mergeItem(key, JSON.stringify(data));
      callback();
    } else {
      callback();
    }
  },

  async select(key, onSuccess, onError) {
    try {
      let result = await AsyncStorage.getItem(key);
      onSuccess(JSON.parse(result));
    } catch (error) {
      onError(error);
    }
  },

  async delete(key, callback) {
    await AsyncStorage.removeItem(key);
    callback({ result: "Success" });
  },

  async append(key, data, callback) {
    let orig = await this.retrieve(key);
    let origData = JSON.parse(orig);
    origData.push(data);
    await this.merge(key, JSON.stringify(origData));
    callback({ result: "Success" });
  },
};
