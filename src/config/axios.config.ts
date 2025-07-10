import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../constants/";
import { showToast } from "../utils";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json", // This is critical
  },
});

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (!error.response) {
      showToast("error", "Network error. Please check your connection.");
    }
    if (error.response?.status === 403) {
      window.location.href = "/forbidden"; // redirect to your 403 page
    }
    // if (error.response?.status >= 500) {
    //   window.location.href = "/server-error"; // redirect to your 403 page
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
