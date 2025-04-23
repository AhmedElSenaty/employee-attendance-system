import axiosInstance from "../../config/axios.config";
import { IAdminCredentials } from "../../interfaces/";

// Fetches a list of admins with pagination and search functionality
// Takes the page number, page size, search type, search query, and token for authentication
export const fetchAllAdmins = async (
  page: number,
  pageSize: number,
  searchType: string,
  searchQuery: string,
  token: string
) => {
  try {
    // Sending GET request to fetch the list of admins
    const response = await axiosInstance.get(`/Admin`, {
      params: {
        PageIndex: page,      // The current page index
        PageSize: pageSize,   // The number of admins per page
        [searchType]: searchQuery, // Dynamic search type (e.g., name, email, etc.)
      },
      headers: {
        Authorization: `Bearer ${token}`, // Attach Bearer token for authentication
      },
    });

    // Return the admin data from the response
    return response.data;
  } catch (error) {
    // If an error occurs, log it and throw it to be handled elsewhere
    console.error("Error fetching admins:", error);
    throw error; // Propagate the error to the calling function
  }
};


// Function to create a new admin by sending a POST request to the backend
export const createAdmin = async (adminData: IAdminCredentials, token: string) => {
  try {
    // Sending a POST request to the "/Account/RegisterAdmin" endpoint with admin data and an authorization token
    const response = await axiosInstance.post("/Account/RegisterAdmin", adminData, {
      headers: { 
        Authorization: `Bearer ${token}` // Set the Authorization header with the Bearer token
      },
    });
    
    // Return the response object from the API
    return response;
  } catch (error) {
    // Log error if the request fails
    console.error("Error creating admin:", error);
    throw error; // Rethrow the error for further handling in the calling function
  }
};


// Function to update an existing admin with error handling
export const updateAdmin = async (adminData: IAdminCredentials, token: string) => {
  try {
    // Send a PUT request to update the admin with the provided data and token for authentication
    const response = await axiosInstance.put("/Admin", adminData, {
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

// Function to fetch admin details by ID with error handling
export const fetchAdminByID = async (adminID: string, token: string) => {
  try {
    // Send a GET request to fetch the admin details by ID with the provided token for authentication
    const response = await axiosInstance.get(`/Admin/${adminID}`, {
      headers: { Authorization: `Bearer ${token}` }, // Authorization header with the Bearer token
    });

    // Return the fetched data (the admin details) from the response if the fetch is successful
    return response.data;
  } catch (error) {
    // Catch any errors and handle them (e.g., log the error or throw it)
    console.error("Error fetching admin by ID:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
};

// Sends a DELETE request to remove an admin by ID
// Requires the admin's ID and a valid authorization token
export const deleteAdminByID = async (id: string, token: string) => {
  try {
    // Sending DELETE request to the server to remove the admin by ID
    const response = await axiosInstance.delete(
      `/Admin/${id}`, // Endpoint to delete the admin by ID
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach Bearer token for authentication
        },
      }
    );
    
    // Return the response if the request is successful
    return response;
  } catch (error) {
    // If an error occurs, log it and throw it to be handled elsewhere
    console.error("Error deleting admin:", error);
    throw error; // Propagate the error to the calling function
  }
};
