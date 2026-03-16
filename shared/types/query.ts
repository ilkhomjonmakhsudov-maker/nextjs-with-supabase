// ── API Query Params ─────────────────────────────────────────
export interface GridQueryParams {
  sortField?: string;
  sortDir?: "asc" | "desc";
  filters?: Record<string, FilterCondition>;
  page?: number;
  pageSize?: number;
}

export interface FilterCondition {
  filterType: "text" | "number" | "date";
  type: string;
  filter?: string | number;
  filterTo?: string | number;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
}
