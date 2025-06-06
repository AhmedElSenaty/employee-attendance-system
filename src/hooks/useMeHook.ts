import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMe, updateAdminProfile, updateEmployeeProfile, updateMyPassword, uploadEmployeeImage } from "../services";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { AdminProfileCredentials, EmployeeProfileCredentials, IErrorResponse } from "../interfaces";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";

const FETCH_ME_QUERY_KEY = "me";

const useFetchMe = () => {
  const token = useUserStore((state) => state.token);
  const userRole = useUserStore((state) => state.role);

  const { data, isLoading } = useQuery({
    queryKey: [FETCH_ME_QUERY_KEY, userRole, token],
    queryFn: () => fetchMe(userRole, token),
    enabled: !!token && !!userRole,
  });

  return {
    me: data?.data,
    isLoading,
  };
};

const useManageMe = () => {
  const token = useUserStore((state) => state.token);
  const userID = useUserStore((state) => state.id);
  const userRole = useUserStore((state) => state.role);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  // Mutation to update the password
  const updatePasswordMutation = useMutation({
    mutationFn: ({ password, oldPassword }: { password: string, oldPassword: string }) => {
      const data = {
        password: password,
        oldPassword: oldPassword,
      };
      
      return updateMyPassword(data, token); // Call the update service function
    },
    onSuccess: (response) => {
      // Show success message on password update
      const { status, data } = response;
      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message); // Show toast with success message
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language); // Handle error with appropriate messages
    },
  })

    // Mutation for updating an existing admin
    const updateAdminMutation = useMutation({
      
      mutationFn: (adminData: AdminProfileCredentials) => updateAdminProfile(adminData, token),
      
      onSuccess: ({ status, data }) => {
        if (status === 200) {
          const message = getTranslatedMessage(data?.message ?? "", language);
          showToast("success", message);
        }
      },
      
      // Handle errors from the API call
      onError: (error) => {
        const axiosError = error as AxiosError<IErrorResponse>;
        handleApiError(axiosError, language); // Handle the error in a consistent way
      },
    });
    // Mutation for updating an existing admin
    const updateEmployeeMutation = useMutation({
      mutationFn: (employeeData: EmployeeProfileCredentials) => updateEmployeeProfile(employeeData, token),
      
      onSuccess: ({ status, data }) => {
        queryClient.invalidateQueries({ queryKey: [FETCH_ME_QUERY_KEY, userRole, token] });

        if (status === 200) {
          const message = getTranslatedMessage(data?.message ?? "", language);
          showToast("success", message);
        }
      },
      
      // Handle errors from the API call
      onError: (error) => {
        const axiosError = error as AxiosError<IErrorResponse>;
        handleApiError(axiosError, language); // Handle the error in a consistent way
      },
    });

    const uploadImageMutation = useMutation({
      mutationFn: (file: File) => uploadEmployeeImage(userID, file, token),
      onSuccess: ({ status, data }) => {
        if (status === 200) {
          queryClient.invalidateQueries({ queryKey: [FETCH_ME_QUERY_KEY, userRole, token] });
          const message = getTranslatedMessage(data?.message ?? "Profile image updated", language);
          showToast("success", message);
        }
      },
      onError: (error) => {
        const axiosError = error as AxiosError<IErrorResponse>;
        handleApiError(axiosError, language);
      },
    });

  return {
    // Expose mutations and loading states
    updateMyPassword: updatePasswordMutation.mutate,
    isUpdateMyPasswordLoading: updatePasswordMutation.isPending,

    // Expose mutations and loading states
    updateAdminProfile: updateAdminMutation.mutate,
    isUpdateAdminProfileLoading: updateAdminMutation.isPending,

    // Expose mutations and loading states
    updateEmployeeProfile: updateEmployeeMutation.mutate,
    isUpdateEmployeeProfileLoading: updateEmployeeMutation.isPending,

    uploadEmployeeImage: uploadImageMutation.mutate,
    isUploadImageLoading: uploadImageMutation.isPending,
  };
};

export { 
  useFetchMe,
  useManageMe
};


export default useFetchMe;
