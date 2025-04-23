import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";
import { IFilters } from "../interfaces";

export function useFiltersHook() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Memoized helpers
  const getParam = useCallback((key: string): string | null => {
    return searchParams.get(key);
  }, [searchParams]);

  const getNumberParam = useCallback((key: string): number | undefined => {
    const value = getParam(key);
    const parsed = parseInt(value ?? "");
    return isNaN(parsed) ? undefined : parsed;
  }, [getParam]);

  // Extract filters from URL
  const filters = useMemo(() => ({
    page: getNumberParam("page"),
    pageSize: getNumberParam("pageSize"),
    sort: getParam("sort") as IFilters["sort"],
    searchKey: getParam("searchKey") as IFilters["searchKey"],
    search: getParam("search") as IFilters["search"],
    startDate: getParam("startDate") as IFilters["startDate"],
    endDate: getParam("endDate") as IFilters["endDate"],
    startTime: getParam("startTime") as IFilters["startTime"],
    endTime: getParam("endTime") as IFilters["endTime"],
    status: getParam("status") as IFilters["status"],
    searchByDepartmentId: getNumberParam("searchByDepartmentId"),
    searchBySubDeptartmentId: getNumberParam("searchBySubDeptartmentId"),
  }), [getParam, getNumberParam]);

  // Set new filters into URL
  const setFilters = useCallback((newFilters: Partial<IFilters>) => {
    setSearchParams((params) => {
      const updatedParams = new URLSearchParams(params);

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          updatedParams.set(key, value.toString());
        } else {
          updatedParams.delete(key); // Remove empty filters
        }
      });

      return updatedParams;
    });
  }, [setSearchParams]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  return {
    ...filters,
    setFilters,
    resetFilters,
  };
}
