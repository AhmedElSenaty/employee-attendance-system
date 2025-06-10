export class BaseService {
  constructor(protected token: string) {}

  protected getAuthHeaders() {
    return { Authorization: `Bearer ${this.token}` };
  }
  protected buildParams(params: Record<string, string | number | boolean | undefined | null>) {
    const filtered: Record<string, string | number | boolean> = {};
  
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        filtered[key] = value;
      }
    });
  
    return filtered;
  }
  
  protected handleError(error: unknown, context?: string) {
    console.error(context || "Service Error:", error);
    throw error;
  }
}
