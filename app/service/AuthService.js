import api from "../axiosInstance";
export const login = async (data) => {
  const response = await api({
    url: "v1/auth/login",
    method: "POST",
    data: data,
  });
  return response;
};

export const getUserInfo = async () => {
  const response = await api({ url: "v1/auth/info" });
  return response;
};
