import axiosInstance from "../../config/axios.config";
import { IAttendanceCredentials } from "../../interfaces";

export const fetchAllAttendances = async (
  page: number, pageSize: number, searchType: string, 
  searchQuery: string, startDate: string, endDate: string, 
  startTime: string, endTime: string, status: string, 
  searchByDepartmentId: number, searchBySubDeptartmentId: number,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Attendance`, {
      params: {
        PageIndex: page,
        PageSize: pageSize,
        [searchType]: searchQuery,
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        EndTime: endTime,
        Status: status,
        SearchByDeptartmentId: searchByDepartmentId === 0 ? "" : searchByDepartmentId,
        SearchBySubDeptartmentId: searchBySubDeptartmentId === 0 ? "" : searchBySubDeptartmentId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching all attendances:", error);
    throw error;
  }
};

export const fetchAttendanceOverview = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/Attendance/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    throw error;
  }
};

export const fetchLatestAttendance = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/Attendance/LatestAttendance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance overview:", error);
    throw error;
  }
};

export const fetchDepartmentAttendanceOverview = async (startDate: string, endDate: string, departmentID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/Attendance/departmentOverView`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        StartDate: startDate,
        EndDate: endDate,
        DepartmentId: departmentID === 0 ? "" : departmentID,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching department attendance overview:", error);
    throw error;
  }
};

export const fetchAllAttendanceSummary = async (
  page: number, pageSize: number, searchType: string, 
  searchQuery: string, startDate: string, endDate: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(`/Attendance/summary`, {
      params: {
        PageIndex: page,
        PageSize: pageSize,
        [searchType]: searchQuery,
        StartDate: startDate,
        EndDate: endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    throw error;
  }
};

export const fetchAttendanceByID = async (attendanceID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/Attendance/${attendanceID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching attendance by ID ${attendanceID}:`, error);
    throw error;
  }
};

export const fetchDetailedAttendanceByID = async (attendanceID: number, token: string) => {
  try {
    const response = await axiosInstance.get(`/Attendance/GetDetailedAttendanceById/${attendanceID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching detailed attendance by ID ${attendanceID}:`, error);
    throw error;
  }
};

export const createAttendance = async (attendance: IAttendanceCredentials, token: string) => {
  try {
    const response = await axiosInstance.post("/Attendance", attendance, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error creating attendance:", error);
    throw error;
  }
};

export const updateAttendance = async (attendance: IAttendanceCredentials, token: string) => {
  try {
    const response = await axiosInstance.put("/Attendance", attendance, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error updating attendance:", error);
    throw error;
  }
};

export const deleteAttendanceByID = async (attendanceID: number, token: string) => {
  try {
    return await axiosInstance.delete(`/Attendance/${attendanceID}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Error deleting attendance ID ${attendanceID}:`, error);
    throw error;
  }
};

export const fetchAttendanceCalender = async (
  employeeID: string, startDate: string, endDate: string, token: string
) => {
  try {
    const response = await axiosInstance.get(`/Attendance/calendar`, {
      params: {
        EmployeeId: employeeID,
        StartDate: startDate,
        EndDate: endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attendance calendar:", error);
    throw error;
  }
};
