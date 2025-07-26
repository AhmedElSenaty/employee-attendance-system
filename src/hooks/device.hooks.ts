import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DeviceCredentials,
  IErrorResponse,
  initialMetadata,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { useUserStore, useLanguageStore } from "../store/";
import { DeviceService } from "../services";
import { QueryKeys } from "../constants";
import { DeviceFormValues } from "../validation";

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
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = useDeviceService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Devices.All,
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () =>
      deviceService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    devices: data?.data?.data?.devices || [],
    count: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetDeviceUsers = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = useDeviceService();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      QueryKeys.Devices.All,
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () =>
      deviceService.fetchAllDeviceUsers(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    deviceUsers: data?.data?.data?.deviceUsers || [],
    count: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
    refetch,
  };
};

export const useGetDeviceByID = (
  deviceId: number,
  resetInputs?: (data: DeviceFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const deviceService = useDeviceService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Devices.Details, deviceId],
    queryFn: () => deviceService.fetchByID(deviceId),
    enabled: !!deviceId && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetInputs?.(data.data?.data);
    }
  }, [data, resetInputs]);

  return {
    device: data?.data?.data,
    isLoading,
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
    devices: data?.data?.data || [],
    isLoading,
  };
};

export const useCreateDevice = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = useDeviceService();

  return useMutation({
    mutationFn: (deviceData: DeviceCredentials) =>
      deviceService.create(deviceData),
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
    mutationFn: (deviceData: DeviceCredentials) =>
      deviceService.update(deviceData),
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
    mutationFn: (deviceId: number) => deviceService.delete(deviceId),
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

export const useToggleRole = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const deviceService = useDeviceService();

  return useMutation({
    mutationFn: (user: {
      ip: string;
      uid: number;
      employeeID: number;
      newRole: number;
      name: string;
    }) =>
      deviceService.toggleRole(
        user.ip,
        user.uid,
        user.employeeID,
        user.newRole,
        user.name
      ),
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
