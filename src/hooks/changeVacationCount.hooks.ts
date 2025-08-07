import { useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { IErrorResponse, initialMetadata } from "../interfaces";
import { getTranslatedMessage, handleApiError, showToast } from "../utils";
import { useLanguageStore, useUserStore } from "../store/";
import { QueryKeys } from "../constants";
import { ChangeVacationCountService } from "../services/changeVacationCount.services";
import { ChangeVacationCountFormValues } from "../validation/changeVacationCount.schema";
import {
  AddChangeVacationsDto,
  ChangeVacationCountsRequestDto,
} from "../interfaces/changeVacationCountRequests";

export const useEntityService = () => {
  const token = useUserStore((state) => state.token);

  const service = useMemo(() => {
    return new ChangeVacationCountService(token);
  }, [token]);

  return service;
};

export const useGetChangeVacationRequests = (
  page?: number,
  pageSize?: number,
  searchKey?: string,
  searchQuery?: string
) => {
  const token = useUserStore((state) => state.token);
  const entityService = useEntityService();

  const { data, isLoading } = useQuery({
    queryKey: [
      QueryKeys.ChangeVacationRequests.All,
      page,
      pageSize,
      `${searchKey && searchQuery ? [searchKey, searchQuery] : ""}`,
    ],
    queryFn: () =>
      entityService.fetchAll(page, pageSize, searchKey, searchQuery),
    enabled: !!token,
  });
  return {
    requests: data?.data?.data?.requests || [],
    metadata: data?.data?.data?.metadata || initialMetadata,
    isLoading,
  };
};

export const useGetByID = (
  id: number,
  resetEditInputs?: (data: ChangeVacationCountFormValues) => void
) => {
  const token = useUserStore((state) => state.token);
  const entityService = useEntityService();

  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.ChangeVacationRequests.Details, id],
    queryFn: () => entityService.fetchByID(id),
    enabled: !!id && !!token,
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

export const useCreateChangeVacationRequest = () => {
  const queryClient = useQueryClient();
  const { language } = useLanguageStore();
  const changeVacationService = useEntityService();

  return useMutation({
    mutationFn: async (data: AddChangeVacationsDto) => {
      const formData = new FormData();

      formData.append("EmployeeId", data.employeeId.toString());

      if (data.totalCasual != null)
        formData.append("TotalCasual", data.totalCasual.toString());
      if (data.availableCasual != null)
        formData.append("AvilableCasual", data.availableCasual.toString());
      if (data.totalOrdinary != null)
        formData.append("TotalOrdinary", data.totalOrdinary.toString());
      if (data.availableOrdinary != null)
        formData.append("AvilableOrdinary", data.availableOrdinary.toString());
      if (data.totalLeaveRequest != null)
        formData.append("TotalLeaveRequest", data.totalLeaveRequest.toString());
      if (data.availableLeaveRequest != null)
        formData.append(
          "AvilableLeaveRequest",
          data.availableLeaveRequest.toString()
        );

      if (data.description) formData.append("Description", data.description);
      if (data.comment) formData.append("Comment", data.comment);

      formData.append("MedicalReportImageUrl", data.medicalReportImageUrl);

      // Debug output
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      console.log(formData);
      return await changeVacationService.create(formData);
    },

    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ChangeVacationRequests.All],
      });

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

export const useUpdate = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = useEntityService();

  return useMutation({
    mutationFn: (entityData: ChangeVacationCountsRequestDto) =>
      entityService.update(entityData),

    onMutate: async (entityData) => {
      console.log("[Update] About to update entity:", entityData); // ✅ Log input data here
    },

    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ChangeVacationRequests.All],
      });

      if (status === 200) {
        const message = getTranslatedMessage(data.message ?? "", language);
        showToast("success", message);
      }

      console.log("[Update] Response data:", data); // ✅ Log response
    },

    onError: (error) => {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language);
    },
  });
};

export const useAccept = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = useEntityService();

  return useMutation({
    mutationFn: (id: number) => entityService.accept(id),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ChangeVacationRequests.All],
      });

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

export const useReject = () => {
  const { language } = useLanguageStore();
  const queryClient = useQueryClient();
  const entityService = useEntityService();

  return useMutation({
    mutationFn: (id: number) => entityService.reject(id),
    onSuccess: ({ status, data }) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.ChangeVacationRequests.All],
      });

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
