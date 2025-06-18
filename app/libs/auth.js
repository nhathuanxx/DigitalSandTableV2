import { storageKeys } from "./constants";
import storage from "./storage";

export const getTokens = () => {
  return {
    access_token: storage.get(storageKeys.ACCESS_TOKEN),
    refresh_token: storage.get(storageKeys.REFRESH_TOKEN),
  };
};
export const getPartner = () => {
  return {
    partner: storage.get(storageKeys.PARTNER),
  };
};

export const getDomain = () => {
  return {
    domain: storage.get("domain"),
  };
};
export const hasTokens = async () => {
  const { access_token, refresh_token } = await getTokens();

  return Boolean(access_token && refresh_token);
};

export const setTokens = async ({
  access_token,
  refresh_token,
  remove_token,
}) => {
  if (access_token) {
    await storage.set(storageKeys.ACCESS_TOKEN, access_token);
  }

  if (refresh_token) {
    await storage.set(storageKeys.REFRESH_TOKEN, refresh_token);
  }
  if (remove_token) {
    await storage.set(storageKeys.REMOVE_TOKEN, remove_token);
  }
};
export const setPartner = async ({ key, value }) => {
  await storage.set(key, value);
};

export const setUserInfo = async ({ key, value }) => {
  await storage.set(key, value);
};

export const getUserInfo = () => {
  return {
    userInfo: storage.get(storageKeys.USER_INFO),
  };
};
