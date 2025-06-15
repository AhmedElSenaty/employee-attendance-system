import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDeviceCredentials, IErrorResponse, initialMetadata } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useUserStore, useLanguageStore } from "../store/";
import { DeviceService } from "../services";
import { QueryKeys } from "../constants";

export const useDeviceService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new DeviceService(token);
  }, [token]);

  return service;
};

export const useGetDevices = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  debouncedSearchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = useDeviceService();
  
  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Devices.All, 
      page, 
      pageSize, 
      `${searchKey && debouncedSearchQuery ? [searchKey, debouncedSearchQuery] : ""}`, 
    ],
    queryFn: () => deviceService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    devices: data?.data?.data?.devices || [],
    totalDevices: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isDevicesDataLoading: isLoading,
  };
};

export const useGetDeviceByID = (
  deviceID: number,
  resetInputs?: (data: IDeviceCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = useDeviceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Devices.Details, deviceID],
    queryFn: () => deviceService.fetchByID(deviceID),
    enabled: !!deviceID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data.data?.data);
    }
  }, [data, resetInputs]);

  return {
    device: data?.data?.data,
    isDeviceDataLoading: isLoading,
  };
};


export const useGetDevicesList = () => {
  const token = useUserStore((state) => state.token);
  const deviceService = useDeviceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Devices.List],
    queryFn: () => deviceService.fetchList(),
    enabled: !!token,
  });

  return {
    devicesList: data?.data?.data || [],
    devicesListIsLoading: isLoading,
  };
};

export const useCreateDevice = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = useDeviceService();

  return useMutation({
    mutationFn: (deviceData: IDeviceCredentials) => deviceService.create(deviceData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Devices.All] });
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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = useDeviceService();

  return useMutation({
    mutationFn: (deviceData: IDeviceCredentials) => deviceService.update(deviceData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Devices.All] });
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
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = useDeviceService();

  return useMutation({
    mutationFn: (deviceID: number) => deviceService.delete(deviceID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Devices.All] });
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
