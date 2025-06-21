import { useQuery } from "@tanstack/react-query";
import { initialMetadata } from "../interfaces";
import { useMemo } from "react";
import { useUserStore } from "../store/";
import { LogService } from "../services";
import { QueryKeys } from "../constants";

/**
 * Custom hook to instantiate and memoize LogService with the current user token.
 * Recreates the service instance only when the token changes.
 *
 * @returns An instance of LogService initialized with the auth token.
 */
export const useLogService = () => {
  // Get current user token from the global store
  const token = useUserStore((state) => state.token);

  // Memoize LogService instance to avoid unnecessary re-instantiations
  const service = useMemo(() => {
    return new LogService(token);
  }, [token]);

  return service;
};

/**
 * Hook to fetch paginated, filtered logs using react-query.
 *
 * @param page - Current page number for pagination.
 * @param pageSize - Number of items per page.
 * @param searchKey - Field name to search on (e.g., "UserID").
 * @param debouncedSearchQuery - Search value (debounced to reduce API calls).
 * @param type - Log type filter (e.g., Create, Update, Error).
 * @param startDate - Filter logs starting from this date.
 * @param endDate - Filter logs up to this date.
 * @returns An object containing logs array, total count, metadata, and loading state.
 */
export const useGetLogs = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  debouncedSearchQuery?: string,
  type?: string,
  startDate?: string,
  endDate?: string,
) => {
  // Get current auth token from store
  const token = useUserStore((state) => state.token);
  // Get memoized LogService instance
  const logService = useLogService();
  
  // Use React Query to fetch logs data
  const { data, isLoading } = useQuery({
    // Unique cache key includes all filters and pagination params
    queryKey: [
      QueryKeys.Logs.All, 
      page, 
      pageSize, 
      // Only include search params if both key and query exist
      `${searchKey && debouncedSearchQuery ? [searchKey, debouncedSearchQuery] : ""}`, 
      type, 
      startDate, 
      endDate
    ],
    // Query function calls fetchAll with all parameters
    queryFn: () => logService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery, type, startDate, endDate),
    // Enable query only if token is available
    enabled: !!token,
  });

  // Return structured data and loading state for consumption in components
  return {
    logs: data?.data?.data?.logs || [],
    count: data?.data?.data?.totalCount || 0,
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

/**
 * Hook to fetch a single log entry by ID using react-query.
 *
 * @param logId - Unique identifier of the log to fetch.
 * @returns An object containing the log data and loading state.
 */
export const useGetLogByID = (
  logId: number,
) => {
  // Get current auth token from store
  const token = useUserStore((state) => state.token);
  // Get memoized LogService instance
  const logService = useLogService();

  // Use React Query to fetch a specific log entry by ID
  const { data, isLoading } = useQuery({
    // Cache key includes log details identifier and log ID
    queryKey: [QueryKeys.Logs.Details, logId],
    // Query function calls fetchByID with the given logId
    queryFn: () => logService.fetchByID(logId),
    // Enable query only if logId and token are valid/truthy
    enabled: !!logId && !!token,
  });

  // Return the log data and loading status for use in UI
  return {
    log: data?.data?.data,
    isLoading,
  };
};