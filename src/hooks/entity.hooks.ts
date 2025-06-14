import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  IErrorResponse,
  IEntityCredentials,
  initialMetadata,
} from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";
import { EntityService } from "../services";

export const ENTITIES_QUERY_KEY = "Entities";
export const ENTITY_DETAILS_QUERY_KEY = "EntityDetails";
export const ENTITIES_LIST_QUERY_KEY = "entitiesList";

export const useGetEntities = (
  page: number,
  pageSize: number,
  searchKey: string,
  debouncedSearchQuery: string
) => {
  const token = useUserStore((state) => state.token);
  const entityService = new EntityService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ENTITIES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => entityService.fetchAll(page, pageSize, searchKey, debouncedSearchQuery),
    enabled: !!token,
  });

  return {
    entities: data?.data?.entities || [],
    metadata: data?.data?.metadata || initialMetadata,
    totalEntities: data?.data?.totalCount || 0,
    isEntitiesDataLoading: isLoading,
  };
};

export const useGetEntityByID = (
  entityID: number,
  resetEditInputs?: (data: IEntityCredentials) => void
) => {
  const token = useUserStore((state) => state.token);
  const entityService = new EntityService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ENTITY_DETAILS_QUERY_KEY, entityID],
    queryFn: () => entityService.fetchByID(entityID),
    enabled: !!entityID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetEditInputs?.(data.data);
    }
  }, [data, resetEditInputs]);

  return {
    entity: data?.data,
    isEntityDataLoading: isLoading,
  };
};

export const useGetEntitiesList = () => {
  const token = useUserStore((state) => state.token);
  const entityService = new EntityService(token);

  const { data, isLoading } = useQuery({
    queryKey: [ENTITIES_LIST_QUERY_KEY],
    queryFn: () => entityService.fetchList(),
    enabled: !!token,
  });

  return {
    entitiesList: data ?? [],
    entitiesListIsLoading: isLoading,
  };
};

export const useCreateEntity = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = new EntityService(token);

  return useMutation({
    mutationFn: (entityData: IEntityCredentials) => entityService.create(entityData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = new EntityService(token);

  return useMutation({
    mutationFn: (entityData: IEntityCredentials) => entityService.update(entityData),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY] });

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
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = new EntityService(token);

  return useMutation({
    mutationFn: (entityID: number) => entityService.delete(entityID),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({ queryKey: [ENTITIES_QUERY_KEY] });

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
