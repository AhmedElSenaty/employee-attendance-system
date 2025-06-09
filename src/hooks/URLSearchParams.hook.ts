import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";

type Params = Record<string, string>;

interface UseURLSearchParamsOptions {
  replace?: boolean;    // Whether to replace history entry or push new one (default: true)
  debounceMs?: number;  // Optional debounce delay (not implemented here, but extensible)
}

const useURLSearchParams = (options?: UseURLSearchParamsOptions) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const replace = options?.replace ?? true;

  // Get all query params as an object
  const getAllParams = useCallback((): Params => {
    const params: Params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  // Get param by key, optionally transform it (e.g. number, boolean)
  const getParam = useCallback(<T = string>(key: string, parser?: (val: string) => T): T | null => {
    const val = searchParams.get(key);
    if (val === null) return null;
    if (parser) return parser(val);
    return val as unknown as T;
  }, [searchParams]);

  // Set or update a single param (string value)
  const setParam = useCallback((key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    navigate({ search: newParams.toString() }, { replace });
  }, [navigate, searchParams, replace]);

  // Set multiple params at once
  const setParams = useCallback((params: Params) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    navigate({ search: newParams.toString() }, { replace });
  }, [navigate, searchParams, replace]);

  // Delete a param by key
  const deleteParam = useCallback((key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    navigate({ search: newParams.toString() }, { replace });
  }, [navigate, searchParams, replace]);

  // Clear all params
  const clearParams = useCallback(() => {
    navigate({ search: '' }, { replace });
  }, [navigate, replace]);

  return {
    getAllParams,
    getParam,
    setParam,
    setParams,
    deleteParam,
    clearParams,
  };
};

export default useURLSearchParams;
