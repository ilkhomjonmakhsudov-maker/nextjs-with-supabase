// ── Grid View ────────────────────────────────────────────────
export interface GridView {
  id: string;
  user_id: string;
  table_name: "orders" | "invoices";
  name: string;
  is_default: boolean;
  column_state: ColumnStateItem[] | null;
  filter_model: Record<string, unknown> | null;
  sort_model: SortModelItem[] | null;
  created_at: string;
  updated_at: string;
}

export interface ColumnStateItem {
  colId: string;
  hide?: boolean;
  width?: number;
  pinned?: string | null;
  sort?: "asc" | "desc" | null;
  sortIndex?: number | null;
  aggFunc?: string | null;
  rowGroup?: boolean;
  rowGroupIndex?: number | null;
  pivot?: boolean;
  pivotIndex?: number | null;
  flex?: number | null;
}

export interface SortModelItem {
  colId: string;
  sort: "asc" | "desc";
}
