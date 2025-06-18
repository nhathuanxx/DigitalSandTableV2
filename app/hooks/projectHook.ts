import { getList, pushDataUser, getListUserData, getProjectDetail, getMapTypes,downloadFile } from "@app/service/ProjectService";
import { useQuery, useQueryClient, useMutation } from "react-query";

export enum ServerStateKeysEnum {
    Items = "Projects",
    PushDataUser = "PushDataUser",
    ListUserData = "ListUserData",
    ProjectDetail = "ProjectDetail",
    MapTypes = "MapTypes",
    DownloadFile = "DownloadFile"
}

export const useGetList = (config: object): any => {
    return useQuery({
        queryKey: [ServerStateKeysEnum.Items],
        queryFn: () => getList(),
        ...config,
    });
};

export const useGetMapTypes = (config: object): any => {
    return useQuery({
        queryKey: [ServerStateKeysEnum.MapTypes],
        queryFn: () => getMapTypes(),
        ...config,
    });
};
export const usePushDataUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: pushDataUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.PushDataUser] });
        },
    });
};

export const useDownloadFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: downloadFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ServerStateKeysEnum.DownloadFile] });
        },
    });
};

export const useGetListUserData = (params: object, config: object): any => {
    return useQuery({
        queryKey: [ServerStateKeysEnum.ListUserData],
        queryFn: () => getListUserData(params.id),
        ...config,
    });
};

export const useGetProjectDetail = (params: object, config: object): any => {
    return useQuery({
        queryKey: [ServerStateKeysEnum.ProjectDetail],
        queryFn: () => getProjectDetail(params.id),
        ...config,
    });
};
