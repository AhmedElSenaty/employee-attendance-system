import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosError } from 'axios';
import { RootState } from '../context/store';
import { useNavigate } from 'react-router';
import { SubmitHandler } from 'react-hook-form';
import { IErrorResponse, ILoggedInUser, ILoginCredentials, ILoginResponse, initialLoginResponse, IResetAccountCredentials } from '../interfaces';
import { login, parseToken, resetAccountService } from '../services/auth';
import { getTranslatedMessage, handleApiError, showToast } from '../utils';
import { setUser } from '../context/slices/userSlice';
import { fetchAuthorizedUserPermissions } from '../services/admin';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<ILoginResponse>(initialLoginResponse);
  const { language } = useSelector((state: RootState) => state.language);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ILoginCredentials> = async (request: ILoginCredentials) => {
    setIsLoading(true);

    try {
      const data = await login(request);
      const message = getTranslatedMessage(data.message ?? "", language);

      if (data.status === 200) {
        showToast("success", message);
      
        const loggedInUser: ILoggedInUser = parseToken(data.data?.token);
        loggedInUser.rememberMe = request.rememberMe;
      
        const permissions = await fetchAuthorizedUserPermissions(loggedInUser.token);
        loggedInUser.permissions = permissions;
      
        dispatch(setUser(loggedInUser));
        
        const target =
          loggedInUser.role == "admin"
            ? "/admin"
            : loggedInUser.role == "manager"
            ? "/manager"
            : loggedInUser.role == "employee"
            ? "/employee/account"
            : "/";
        
        location.replace(target)
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      const response = axiosError.response?.data as ILoginResponse;
      setResponseData(response);

      if (response.status === 302) {
        const message = getTranslatedMessage(response.message ?? "", language);
        showToast("warn", message);
        navigate("/reset-account");
      } else {
        handleApiError(axiosError, language);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    responseData,
    onSubmit
  };
};

const useResetAccount = () => {
  const navigate = useNavigate();
  const { language } = useSelector((state: RootState) => state.language);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (requestData: IResetAccountCredentials) => {
    setIsLoading(true);
    try {
      const response = await resetAccountService(requestData);
      if (response.status === 200) {
        const message = getTranslatedMessage(response.message ?? "", language);
        showToast("success", message);
        navigate("/login");
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>;
      handleApiError(axiosError, language); // Handle other API errors here
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onSubmit,
  };
};

export {
  useLogin,
  useResetAccount
}