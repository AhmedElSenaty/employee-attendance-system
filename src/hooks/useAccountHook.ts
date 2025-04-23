import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unblockAccountByID, updateAccountPassword } from "../services/admin";
import { useSelector } from "react-redux";
import { selectToken } from "../context/slices/userSlice";
import { RootState } from "../context/store";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";

const useManageAccount = () => {
  // Get token and language from the Redux store
  const token = useSelector(selectToken);
  const { language } = useSelector((state: RootState) => state.language);

  // React Query Client for managing cached data
  const queryClient = useQueryClient();

  // Mutation to update the password
  const updatePasswordMutation = useMutation({
    mutationFn: ({ userID, password, oldPassword }: { userID: string; password: string, oldPassword?: string }) => {
      const data = {
        password: password,
        oldPassword: oldPassword,
        userId: userID,
      };
      console.log(data);
      
      return updateAccountPassword(data, token); // Call the update service function
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
  });

  // Mutation to unblock an account
  const unblockMutation = useMutation({
    mutationFn: (id: string) => unblockAccountByID(id, token), // Call unblock service function
    onSuccess: (response, id) => {
      // Invalidate relevant queries to refresh data after unblocking
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      queryClient.invalidateQueries({ queryKey: ["managers"] });
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["adminDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["managerDetails", id] });
      queryClient.invalidateQueries({ queryKey: ["employeeDetails", id] });

      // Show success message
      if (response.status === 200) {
        const message = getTranslatedMessage(response.data.message ?? "", language);
        showToast("success", message); // Show toast with success message
      }
    },
    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language); // Handle error with appropriate messages
    },
  });

  return {
    // Expose mutations and loading states
    updateAccountPassword: updatePasswordMutation.mutate,
    isUpdateAccountPasswordLoading: updatePasswordMutation.isPending,

    unblockAccount: unblockMutation.mutate,
    isUnblockAccountLoading: unblockMutation.isPending,
  };
};

export { useManageAccount };
