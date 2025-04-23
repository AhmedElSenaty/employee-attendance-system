import axiosInstance from "../../config/axios.config";

// Function to update the account password
export const updateAccountPassword = async (data: { userId: string, password: string, oldPassword?: string }, token: string) => {
  try {
    // Sending the request to update the password
    const response = await axiosInstance.post(`/Account/UpdatePassword`, data, {
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
};


// Sends a PUT request to unblock a user account by ID
// Requires the user's ID and a valid authorization token
export const unblockAccountByID = async (id: string, token: string) => {
  try {
    // Sending PUT request to the server to unblock the user account
    const response = await axiosInstance.put(
      `/Account/unblockAccount/${id}`, // Endpoint to unblock the account by ID
      {}, // No request body needed
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
    console.error("Error unblocking account:", error);
    throw error; // Propagate the error to the calling function
  }
};
