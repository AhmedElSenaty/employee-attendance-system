import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEntity, deleteEntityByID, fetchAllEntities, fetchEntitiesList, fetchEntityByID, updateEntity } from "../services/admin/";
import { IEntityCredentials, IErrorResponse, initialMetadata, UseGetAllEntitiesReturn, UseGetEntityByIDReturn,  } from "../interfaces";
import { AxiosError } from "axios";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore } from "../store/language.store";
import { useUserStore } from "../store/user.store";

const ENTITIES_QUERY_KEY = "entities";
const ENTITIES_LIST_QUERY_KEY = "entitiesList";
const ENTITY_DETAILS_QUERY_KEY = "entityDetails";

const useGetAllEntities = (
  page: number, 
  pageSize: number, 
  searchKey: string, 
  debouncedSearchQuery: string
): UseGetAllEntitiesReturn => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: [ENTITIES_QUERY_KEY, page, pageSize, searchKey, debouncedSearchQuery],
    queryFn: () => fetchAllEntities(page, pageSize, searchKey, debouncedSearchQuery, token),
    enabled: !!token
  });

  return { 
    entities: data?.data.entities || [], 
    totalEntities: data?.data.totalCount || 0, 
    metadata: data?.data.metadata || initialMetadata, 
    isEntitiesDataLoading: isLoading 
  };
};

const useGetEntityByID = (
  entityID: number, 
  resetEditInputs?: (data: IEntityCredentials) => void
): UseGetEntityByIDReturn => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: [ENTITY_DETAILS_QUERY_KEY, entityID],
    queryFn: () => fetchEntityByID(entityID, token),
    enabled: !!entityID && !!token,
  });

  useEffect(() => {
    if (data?.data) {
      resetEditInputs?.(data.data);
    }
  }, [data, resetEditInputs]);

  return { 
    entity: data?.data, 
    isEntityDataLoading: isLoading 
  };
};

const useGetEntitiesList = () => {
  const token = useUserStore((state) => state.token);
  const { data, isLoading } = useQuery({
    queryKey: [ENTITIES_LIST_QUERY_KEY],
    queryFn: () => fetchEntitiesList(token),
    enabled: !!token,
  });

  return { entitiesList: data ?? [], entitiesListIsLoading: isLoading };
};

const useManageEntities = () => {
  const token = useUserStore((state) => state.token);
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: (entityData: IEntityCredentials) => createEntity(entityData, token),
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

  const updateMutation = useMutation({
    mutationFn: (entityData: IEntityCredentials) => updateEntity(entityData, token),
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

  const deleteMutation = useMutation({
    mutationFn: (entityID: number) => deleteEntityByID(entityID, token),
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

  return {
    addEntity: addMutation.mutate,
    isAdding: addMutation.isPending,

    updateEntity: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    
    deleteEntity: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};


export {
  useGetAllEntities,
  useGetEntityByID,
  useGetEntitiesList,
  useManageEntities
};
