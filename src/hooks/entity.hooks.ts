import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { EntityCredentials, IErrorResponse, initialMetadata } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore, useUserStore } from "../store/";
import { EntityService } from "../services";
import { QueryKeys } from "../constants";
import { EntityFormValues } from "../validation";

export const useEntityService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new EntityService(token);
  }, [token]);

  return service;
};

export const useGetEntities = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const entityService = useEntityService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.Entities.All, 
      page, 
      pageSize, 
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`
    ],
    queryFn: () => entityService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });

  return {
    entities: data?.data?.data?.entities || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    count: data?.data?.data?.totalCount || 0,
    isLoading,
  };
};

export const useGetEntityByID = (
  entityID: number,
  resetEditInputs?: (data: EntityFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const entityService = useEntityService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Entities.Details, entityID],
    queryFn: () => entityService.fetchByID(entityID),
    enabled: !!entityID && !!token,
  });

  useEffect(() => {
    if (data?.data?.data) {
      resetEditInputs?.(data.data?.data);
    }
  }, [data, resetEditInputs]);

  return {
    entity: data?.data?.data,
    isLoading,
  };
};

export const useGetEntitiesList = () => {
  const token = useUserStore((state) => state.token);
  const entityService = useEntityService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.Entities.List],
    queryFn: () => entityService.fetchList(),
    enabled: !!token,
  });

  return {
    entitiesList: data?.data?.data ?? [],
    isLoading,
  };
};

export const useCreateEntity = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = useEntityService();

  return useMutation({
    mutationFn: (entityData: EntityCredentials) => entityService.create(entityData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Entities.All] });

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

export const useUpdateEntity = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = useEntityService();

  return useMutation({
    mutationFn: (entityData: EntityCredentials) => entityService.update(entityData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Entities.All] });

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

export const useDeleteEntity = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = useEntityService();

  return useMutation({
    mutationFn: (entityID: number) => entityService.delete(entityID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.Entities.All] });

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
