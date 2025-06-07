import { useMutation, useQuery } from "@tanstack/react-query";
import { IErrorResponse, UseGetAllPermissionsReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { PermissionService } from "../services";

export const PERMISSIONS_QUERY_KEY = "Permissions";

export const useGetPermissions = (): UseGetAllPermissionsReturn => {
  const token = useUserStore((state) => state.token);
  const permissionService = new PermissionService(token);

  const { data, isLoading } = useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY],
    queryFn: () => permissionService.fetchAll(),
    enabled: !!token,
  });

  return {
    permissions: data ?? [],
    totalPermissions: data?.length || 0,
    isPermissionsDataLoading: isLoading,
  };
};

export const useUpdateUserPermissions = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const permissionService = new PermissionService(token);

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
