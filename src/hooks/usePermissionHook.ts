import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAllPermissions, updateUserPermissions } from "../services/admin";
import { IErrorResponse, UseGetAllPermissionsReturn } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";

const PERMISSIONS_QUERY_KEY = "permissions"

const useGetAllPermissions = (): UseGetAllPermissionsReturn => {
  const token = useUserStore((state) => state.token); // Get token from Redux
  const { data, isLoading } = useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY],
    queryFn: () => fetchAllPermissions(token),
    enabled: !!token,
  });

  return { permissions: data ?? [], totalPermissions: data?.length || 0, isPermissionsDataLoading: isLoading };
};

const useManagePermissions = () => {
  const token = useUserStore((state) => state.token); // Get token from Redux
  const { language } = useLanguageStore();

  const updateUserPermissionsMutation = useMutation({
    mutationFn: ({ userID, permissions }: { userID: string; permissions: string[] }) => {
      const data = {
        permissionsIds: permissions,
        userId: userID
      }
      return updateUserPermissions(data, token);
    },
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

  return {
    updateUserPermissions: updateUserPermissionsMutation.mutate,
    isUserPermissionsUpdating: updateUserPermissionsMutation.isPending,
  }
}

export {
  useGetAllPermissions,
  useManagePermissions,

}