import { useQuery, useMutation, useQueryClient } from "react-query";
import PlaceDetailService from "@app/service/PlaceDetailService";

interface Config {
  cacheTime: number;
}

export enum ServerStateKeysEnum {
  getAutoComplete = "getAutoComplete",
  getDirection = "getDirection",
  getPlaceDetail = "getPlaceDetail",
  getPlaceDetailFromLatLong = "getPlaceDetailFromLatLong",
  getPlaceDetailFromAddress = "getPlaceDetailFromAddress",
}
export const useGetAutoComplete = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => PlaceDetailService.getAutoComplete(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getAutoComplete);
    },
  });
};

export const useGetTraffic = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => PlaceDetailService.getTrafficTest(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getAutoComplete);
    },
  });
};

export const useGetDirection = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => PlaceDetailService.getDirection(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getDirection);
    },
  });
};

export const useGetPlaceDetail = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => PlaceDetailService.getPlaceDetail(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getPlaceDetail);
    },
  });
};

export const useGetPlaceDetailFromLatLong = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => PlaceDetailService.getPlaceDetailFromLatLong(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getPlaceDetailFromLatLong);
    },
  });
};

export const useGetPlaceDetailFromAddress = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => PlaceDetailService.getPlaceDetailFromAddress(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getPlaceDetailFromAddress);
    },
  });
};

