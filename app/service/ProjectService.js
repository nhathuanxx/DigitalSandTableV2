import api from "../axiosInstance";
export const getList = async () => {
  return await api({
    url: "v1/projects",
  });
};
export const pushDataUser = async (data) => {
  return await api({
    url: `v1/positions`,
    method: "POST",
    data: data,
  });
};
export const getListUserData = async (id) => {
  return await api({
    url: `v1/positions/${id}`,
  });
};

export const getProjectDetail = async (id) => {
  return await api({
    url: `v1/projects/${id}`,
  });
};

export const getMapTypes = async () => {
  return await api({
    url: `v1/system-configs`,
  });
};

export const downloadFile = async (file_id) => {
  return await api({
    url: `v1/uploads/${file_id}/download`,
  });
};
