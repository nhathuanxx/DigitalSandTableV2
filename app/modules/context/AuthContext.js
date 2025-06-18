import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  Alert
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import i18n from "@app/i18n/i18n";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useLogin, useUserInfo } from "@app/hooks/authHook";
import { showCustomAlert } from '@app/modules/components/alert/CustomAlert';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const queryClient = useQueryClient();
  const loginMutation = useLogin();

  useEffect(() => {
    const loadStoredToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("Error loading token:", err);
      } finally {
        setLoading(false);
      }


    };

    loadStoredToken();
  }, []);

  const { data: userData, refetch: refetchUser } = useUserInfo({
    retry: 1,
    staleTime: Infinity
  });

  useEffect(() => {
    const userNew = userData ? userData.data : null;
    if (userNew && userNew.id) {
      setUser(userData.data);
    } else {
      setUser(null);
    }
  }, [userData]);

  const login = async (username, password) => {
    try {
      setLoading(true);
      const result = await loginMutation.mutateAsync({ username, password });
      const receivedToken = result?.data.token;
      console.log('receivedToken', receivedToken);
      if (receivedToken) {
        setToken(receivedToken);
        setIsLoggedIn(true);
        await AsyncStorage.setItem("token", receivedToken);
        console.log(i18n.t('login.login_success'));
        showCustomAlert({
          type: 'success',
          message: i18n.t('login.login_success'),
        });
      }
      refetchUser();
      setLoading(false);
    } catch (error) {
      showCustomAlert({
        type: 'error',
        message: i18n.t('login.login_fail'),
      });
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('aaaaaaaaa')
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("token");
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isLoggedIn, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
