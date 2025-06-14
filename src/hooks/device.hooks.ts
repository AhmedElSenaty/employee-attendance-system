import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDeviceCredentials, IErrorResponse, initialMetadata } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { DeviceService } from "../services";

export const DEVICES_QUERY_KEY = "devices";
export const DEVICE_DETAILS_QUERY_KEY = "deviceDetails";
export const DEVICES_LIST_QUERY_KEY = "devicesList";

export const useGetDevices = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = new DeviceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEVICES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => deviceService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    devices: data?.data?.devices || [],
    totalDevices: data?.data?.totalCount || 0,
    metadata: data?.data?.metadata || initialMetadata,
    isDevicesDataLoading: isLoading,
  };
};

export const useGetDeviceByID = (
  deviceID: number,
  resetInputs?: (data: IDeviceCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = new DeviceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEVICE_DETAILS_QUERY_KEY, deviceID],
    queryFn: () => deviceService.fetchByID(deviceID),
    enabled: !!deviceID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return {
    device: data?.data,
    isDeviceDataLoading: isLoading,
  };
};


export const useGetDevicesList = () => {
  const token = useUserStore((state) => state.token);
  const deviceService = new DeviceService(token);

  const { data, isLoading } = useQuery({
    queryKey: [DEVICES_LIST_QUERY_KEY],
    queryFn: () => deviceService.fetchList(),
    enabled: !!token,
  });

  return {
    devicesList: data ?? [],
    devicesListIsLoading: isLoading,
  };
};

export const useCreateDevice = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = new DeviceService(token);

  return useMutation({
    mutationFn: (deviceData: IDeviceCredentials) => deviceService.create(deviceData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
      if (status === 201) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

export const useUpdateDevice = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = new DeviceService(token);

  return useMutation({
    mutationFn: (deviceData: IDeviceCredentials) => deviceService.update(deviceData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

export const useDeleteDevice = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = new DeviceService(token);

  return useMutation({
    mutationFn: (deviceID: number) => deviceService.delete(deviceID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [DEVICES_QUERY_KEY] });
      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};
