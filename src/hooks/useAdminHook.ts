import { IErrorResponse, initialMetadata } from "../interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { AxiosError } from "axios";
import { IAdminCredentials, UseGetAdminByIDReturn, UseGetAllAdminsReturn } from "../interfaces/";
import { useEffect } from "react";
import { createAdmin, deleteAdminByID, fetchAdminByID, fetchAllAdmins, updateAdmin } from "../services/admin";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";

const ADMIN_QUERY_KEY = "admins";
const ADMIN_DETAILS_QUERY_KEY = "adminDetails";

// Custom hook to fetch all admins with pagination, search, and debounced query
// It uses `useQuery` to fetch data from the backend and returns the admin data along with loading state and metadata
const useGetAllAdmins = (
  page: number,               // Current page number
  pageSize: number,           // Number of admins per page
  searchKey: string,          // The search key (e.g., email, username)
  debouncedSearchQuery: string // The debounced search query to avoid unnecessary API calls
): UseGetAllAdminsReturn => {
  const token = useUserStore((state) => state.token); // Retrieve the auth token from Redux store

  const { data, isLoading } = useQuery({
    queryKey: [ADMIN_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery], // Unique query key for caching and re-fetching
    queryFn: () => fetchAllAdmins(page, pageSize, searchKey, debouncedSearchQuery, token), // Fetch admin data from API
    enabled: !!token, // Ensure the query is only run if a token exists
  });

  return { 
    admins: data?.data.admins || [],           // List of admins or an empty array if no data
    totalAdmins: data?.data.totalCount || 0,    // Total count of admins (for pagination)
    metadata: data?.data.metadata || initialMetadata, // Additional metadata (e.g., pagination info)
    isAdminsDataLoading: isLoading             // Boolean to indicate if the data is still loading
  };
};

// Custom hook to fetch an admin's details by their ID
const useGetAdminByID = (
  adminID: string, 
  resetInputs?: (data: IAdminCredentials) => void // Optional function to reset form inputs
): UseGetAdminByIDReturn => {
  const token = useUserStore((state) => state.token); // Get the token from Redux store for authorization
  const { data, isLoading } = useQuery({
    queryKey: [ADMIN_DETAILS_QUERY_KEY, adminID], // The query key, combining admin details key and admin ID
    queryFn: () => fetchAdminByID(adminID, token), // Function to fetch admin data
    enabled: !!adminID && !!token, // Query is enabled only if both adminID and token are available
  });

  // Effect hook to reset form inputs with the fetched admin data when available
  useEffect(() => {
    if (data?.data) {
      // If data is fetched successfully, reset form inputs with admin data
      resetInputs?.({ 
        username: data?.data?.username, 
        title: data?.data?.title, 
        email: data?.data?.email, 
        password: "" // Reset password field to empty string for security
      });
    }
  }, [data, resetInputs]); // Runs whenever data or resetInputs change

  // Returning the admin data and loading state
  return { 
    admin: data?.data, 
    isAdminDataLoading: isLoading 
  };
};


const useManageAdmins = () => {
  // Get the token and language from Redux state
  const token = useUserStore((state) => state.token); // Get token from Redux
  const { language } = useLanguageStore();

  // Initialize React Query client for cache and query invalidation
  const queryClient = useQueryClient();

  // Mutation for adding a new admin
  const addMutation = useMutation({
    // The function that makes the API call to create a new admin
    mutationFn: (adminData: IAdminCredentials) => createAdmin(adminData, token),
    
    // Handle the success response after a successful admin creation
    onSuccess: ({ status, data }) => {
      // Invalidate the query to ensure the admin list is refreshed
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY] });
      
      // If the status code is 201 (Created), display a success toast
      if (status === 201) {
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
  const updateMutation = useMutation({
    // The function that makes the API call to update an admin
    mutationFn: (adminData: IAdminCredentials) => updateAdmin(adminData, token),
    
    // Handle the success response after a successful admin update
    onSuccess: ({ status, data }) => {
      // Invalidate the query to ensure the admin list is refreshed
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY] });
      
      // If the status code is 200 (OK), display a success toast
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

  // Mutation for deleting an admin by ID
  const deleteMutation = useMutation({
    // The function that makes the API call to delete an admin by ID
    mutationFn: (adminID: string) => deleteAdminByID(adminID, token),
    
    // Handle the success response after a successful admin deletion
    onSuccess: ({ status, data }) => {
      // Invalidate the query to ensure the admin list is refreshed
      queryClient.invalidateQueries({ queryKey: [ADMIN_QUERY_KEY] });
      
      // If the status code is 200 (OK), display a success toast
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

  return {
    // `addAdminAndGetUserId` is a function that adds an admin and returns the user ID after creation
    addAdminAndGetUserId: addMutation.mutateAsync, // Directly use mutateAsync

    // Loading state for add mutation
    isAdding: addMutation.isPending, // Use `isP.isPending` instead of `isPending`

    // `updateAdmin` is a function that updates an admin's details
    updateAdmin: updateMutation.mutate,
    
    // Loading state for update mutation
    isUpdating: updateMutation.isPending, // Updated naming convention

    // `deleteAdmin` is a function that deletes an admin by ID
    deleteAdmin: deleteMutation.mutate,

    // Loading state for delete mutation
    isDeleting: deleteMutation.isPending, // Updated naming convention
  };
};

export {
  useGetAllAdmins,
  useGetAdminByID,
  useManageAdmins
};
