export interface IFilters {
  page?: number;                        // current page number
  pageSize?: number;                   // number of records per page
  sort?: string;                       // e.g., 'name:asc', 'createdAt:desc'
  searchKey?: string;                  // specific field to search in
  search?: string;                     // general search query
  startDate?: string;                  // e.g., '2024-01-01'
  endDate?: string;                    // e.g., '2024-01-31'
  startTime?: string;                  // e.g., '08:00'
  endTime?: string;                    // e.g., '18:00'
  status?: string;                     // filter by status
  searchByDepartmentId?: number;     // filter by department ID
  searchBySubDeptartmentId?: number;  // filter by sub-department ID
}
