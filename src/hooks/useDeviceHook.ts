import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDeviceCredentials, IErrorResponse, initialMetadata, UseGetAllDevicesReturn, UseGetDevicenByIDReturn } from "../interfaces";
import { AxiosError } from "axios";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { createDevice, deleteDeviceByID, fetchDeviceByID, fetchAllDevices, fetchDevicesList, updateDevice } from "../services/admin";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";

const DEVICES_QUERY_KEY = "devices";
const DEVICES_LIST_QUERY_KEY = "devicesList";
const DEVICE_DETAILS_QUERY_KEY = "deviceDetails";

const useGetAllDevices = (
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllDevicesReturn => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: [DEVICES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllDevices(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token
  });

  return { 
    devices: data?.data.devices || [], 
    totalDevices: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata, 
    isDevicesDataLoading: isLoading 
  };
};

const useGetDeviceByID = (
  deviceID: number, 
  resetInputs?: (data: IDeviceCredentials) => void
): UseGetDevicenByIDReturn => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: [DEVICE_DETAILS_QUERY_KEY, deviceID],
    queryFn: () => fetchDeviceByID(deviceID, token),
    enabled: !!deviceID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetInputs?.(data.data);
    }
  }, [data, resetInputs]);

  return { device: data?.data, isDeviceDataLoading: isLoading };
};

const useGetDevicesList = () => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: [DEVICES_LIST_QUERY_KEY],
    queryFn: () => fetchDevicesList(token),
    enabled: !!token,
  });
  return { devicesList: data ?? [], devicesListIsLoading: isLoading };
};

const useManageDevices = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (deviceData: IDeviceCredentials) => createDevice(deviceData, token),
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

  const updateMutation = useMutation({
    mutationFn: (deviceData: IDeviceCredentials) => updateDevice(deviceData, token),
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

  const deleteMutation = useMutation({
    mutationFn: (deviceID: number) => deleteDeviceByID(deviceID, token),
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

  return {
    addDevice: addMutation.mutate,
    isAdding: addMutation.isPending,

    updateDevice: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteDevice: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};


export {
  useGetAllDevices,
  useGetDeviceByID,
  useGetDevicesList,
  useManageDevices
};
