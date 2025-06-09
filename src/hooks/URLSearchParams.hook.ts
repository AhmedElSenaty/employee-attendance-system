import { useNavigate, useSearchParams } from "react-router";

const useURLSearchParams = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const getAllParams = () => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  };

  const getParam = (key: string): string | null => {
    return searchParams.get(key);
  };

  const setParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    navigate({ search: newParams.toString() }, { replace: true });
  };

  const deleteParam = (key: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete(key);
    navigate({ search: newParams.toString() }, { replace: true });
  };

  const clearParams = () => {
    navigate({ search: '' }, { replace: true });
  };

  return {
    getAllParams,
    getParam,
    setParam,
    deleteParam,
    clearParams,
  };
};

export default useURLSearchParams;
