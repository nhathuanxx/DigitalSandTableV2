import { useMutation, useQuery, useQueryClient } from "react-query";
import { login, getUserInfo } from "@app/service/AuthService";


export enum AuthKeys {
  Login = "Login",
  UserInfo = "UserInfo",
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [AuthKeys.Login] });
    },
  });
};

export const useUserInfo = (config = {}) => {
  return useQuery({
    queryKey: [AuthKeys.UserInfo],
    queryFn: getUserInfo,
    ...config,
  });
};
