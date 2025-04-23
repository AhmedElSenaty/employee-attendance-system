import axiosInstance from "../../config/axios.config";

export const fetchEmployeeAttendanceReport = async (
  searchType: string,
  searchQuery: string,
  startDate: string,
  endDate: string,
  startTime: string,
  endTime: string,
  status: string,
  searchByDeptartmentId: number, 
  searchBySubDeptartmentId: number,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Reports/EmployeeAttendanceReport`, {
      params: {
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        [searchType]: searchQuery,
        SearchByDeptartmentId: searchByDeptartmentId === 0 ? "" : searchByDeptartmentId,
        SearchBySubDeptartmentId: searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });  
    return response.data;
  } catch (error) {
    console.error("Error fetching employee attendance report:", error);
    throw error;
  }
};
