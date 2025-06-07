export class BaseService {
  constructor(protected token: string) {}

  protected getAuthHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }
  
  protected buildParams(
    page?: number,
    pageSize?: number,
    searchType?: string,
    searchQuery?: string
  ): Record<string, number | string> {
    const params: Record<string, number | string> = {};

    params.PageIndex = typeof page === "number" ? page : 1;

    if (typeof pageSize === "number") {
      params.PageSize = pageSize;
    }

    if (searchType && searchQuery) {
      params[searchType] = searchQuery;
    }

    return params;
  }
}
