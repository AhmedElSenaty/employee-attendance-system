import axiosInstance from "../config/axios.config";
import { BaseService } from "./base.services";

/**
 * Service class to handle API calls related to system logs.
 * Extends BaseService to reuse common service functionality.
 */
export class LogService extends BaseService {

    /**
   * Fetch all logs with optional pagination, filtering, and search.
   *
   * @param page - Current page number (pagination), defaults to 1 if not provided.
   * @param pageSize - Number of log entries per page.
   * @param searchType - The log property to search by (e.g., "UserID").
   * @param searchQuery - The value to search for in the specified searchType field.
   * @param type - Filter logs by type (e.g., Create, Update, Delete, Error).
   * @param startDate - Filter logs starting from this date (inclusive), ISO string.
   * @param endDate - Filter logs up to this date (inclusive), ISO string.
   * @returns Promise resolving to the Axios response with the list of logs.
   * @throws Throws an error if the request fails.
   */
  fetchAll = async (
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string,
    type?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    try {
      // Build query parameters object for API request
      const params = this.buildParams({
        PageIndex: page ?? 1, // Default to page 1 if no page given
        PageSize: pageSize,
        StartDate: startDate,
        EndDate: endDate,
        Type: type,
        // If both searchType and searchQuery are provided, add them dynamically
        ...(searchType && searchQuery ? { [searchType]: searchQuery } : {}),
      });

      // Make GET request to "/Logs" endpoint with query params and auth headers
      const response = await axiosInstance.get("/Logs", {
        params,
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      // Log error and rethrow for caller to handle
      console.error("Error fetching all logs:", error);
      throw error;
    }
  };

    /**
   * Fetch a single log entry by its ID.
   *
   * @param id - Unique identifier of the log to retrieve.
   * @returns Promise resolving to the Axios response with the log details.
   * @throws Throws an error if the request fails.
   */
  fetchByID = async (id: number) => {
    try {
      // Make GET request to "/Logs/{id}" endpoint with auth headers
      const response = await axiosInstance.get(`/Logs/${id}`, {
        headers: this.getAuthHeaders(),
      });

      return response;
    } catch (error) {
      // Log error with the specific ID and rethrow
      console.error(`Error fetching log with ID ${id}:`, error);
      throw error;
    }
  };
}
