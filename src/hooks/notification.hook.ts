import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store";
import { QueryKeys } from "../constants";
import { NotificationService } from "../services/notification.services";
import { useMemo } from "react";

export const useNotificationService = () => {
  // Get current user token from the global store
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new NotificationService(token);
  }, [token]);

  return service;
};

export const useGetNotificationCount = () => {
  // Get current auth token from store
  const token = useUserStore((state) => state.token);
  // Get memoized LogService instance
  const notificationService = useNotificationService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Logs.Details],
    queryFn: () => notificationService.getNotificationCount(),
    enabled: !!token,
  });
  const count = data?.data?.data?.count || 0;
  return {
    count: count,
    isLoading,
  };
};
