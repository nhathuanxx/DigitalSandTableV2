import { useQuery, useMutation, useQueryClient } from "react-query";
import WeatherService from "@app/service/WeatherService";

interface Config {
  cacheTime: number;
}

export enum ServerStateKeysEnum {
  getWeather = "getWeather",
}
export const useGetWeather = () => {
  const queryClient = useQueryClient();

  return useMutation((data: any) => WeatherService.getWeather(data), {
    onSuccess: async () => {
      queryClient.invalidateQueries(ServerStateKeysEnum.getWeather);
    },
  });
};



