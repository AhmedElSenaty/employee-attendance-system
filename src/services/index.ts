import axiosInstance from "../config/axios.config";
import { capitalizeFirstLetter } from "../utils";
import { AdminProfileCredentials, EmployeeProfileCredentials } from "../interfaces";

export const fetchMe = async (userRole: string, token: string) => {
  try {
    const response = await axiosInstance.get(`/${capitalizeFirstLetter(userRole)}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching my account:", error);
    throw error;
  }
};

// Function to update an existing admin with error handling
export const updateAdminProfile = async (adminData: AdminProfileCredentials, token: string) => {
  try {
    // Send a PUT request to update the admin with the provided data and token for authentication
    const response = await axiosInstance.put("/Admin/me", adminData, {
      headers: { Authorization: `Bearer ${token}` }, // Authorization header with the Bearer token
    });

    // Return the response from the server if the update is successful
    return response;
  } catch (error) {
    // Catch any errors and handle them (e.g., log the error or throw it)
    console.error("Error updating admin:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};
// Function to update an existing admin with error handling
export const updateEmployeeProfile = async (employeeData: EmployeeProfileCredentials, token: string) => {
  try {
    // Send a PUT request to update the Employee with the provided data and token for authentication
    const response = await axiosInstance.put("/Employee/me", employeeData, {
      headers: { Authorization: `Bearer ${token}` }, // Authorization header with the Bearer token
    });

    // Return the response from the server if the update is successful
    return response;
  } catch (error) {
    // Catch any errors and handle them (e.g., log the error or throw it)
    console.error("Error updating admin:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

export const updateMyPassword = async (data: { password: string, oldPassword: string }, token: string) => {
  try {
    // Sending the request to update the password
    const response = await axiosInstance.post(`/Account/updateMyPassword`, data, {
      headers: { Authorization: `Bearer ${token}` }, // Pass the token in headers for authentication
    });

    // Return the response from the API
    return response;
  } catch (error) {
        // Handle any errors that may occur during the request
    // Catch any errors and handle them (e.g., log the error or throw it)
    console.error("Error updating password:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}

// Function to upload employee profile image
export const uploadEmployeeImage = async (employeeId: string, imageFile: File, token: string) => {
  try {

    const response = await axiosInstance.put(
      `/Employee/ChangeProfileImage?Id=${employeeId}`,
      {NewImage: imageFile},
      {
        headers: {
          Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error uploading employee image:", error);
    throw error;
  }
};


export * from "./attendance.services"
export * from "./base.services"
export * from "./department.services"
export * from "./device.services"
export * from "./entity.services"
export * from "./login.services";
export * from "./officialVacation.services"
export * from "./permission.services"
export * from "./profile.services"
export * from "./report.services"
export * from "./subDepartment.services"