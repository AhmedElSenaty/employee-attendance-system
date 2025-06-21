import { useMutation, useQuery } from "@tanstack/react-query";
import { IErrorResponse } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { PermissionService } from "../services";
import { QueryKeys } from "../constants";
import { useMemo } from "react";
import { useLanguageStore, useUserStore } from "../store";

export const usePermissionService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new PermissionService(token);
  }, [token]);

  return service;
};

export const useGetPermissions = () => {
  const token = useUserStore((state) => state.token);
  const permissionService = usePermissionService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Permissions.All],
    queryFn: () => permissionService.fetchAll(),
    enabled: !!token,
  });

  return {
    permissions: data?.data?.data?.permission ?? [],
    totalPermissions: data?.data?.data?.permission?.length || 0,
    isLoading,
  };
};

export const useUpdateUserPermissions = () => {
  const { language } = useLanguageStore();
  const permissionService = usePermissionService();

  return useMutation({
    mutationFn: ({ userID, permissions }: { userID: string; permissions: string[] }) =>
      permissionService.updateUserPermissions(userID, permissions),
    onSuccess: ({ status, data }) => {
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
