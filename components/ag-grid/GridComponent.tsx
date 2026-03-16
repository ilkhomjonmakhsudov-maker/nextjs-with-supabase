"use client";

import { AgGridReact } from "ag-grid-react";

import type {
  ColDef,
  ColumnMovedEvent,
  ColumnResizedEvent,
  ColumnState,
  ColumnVisibleEvent,
  FilterChangedEvent,
  GridReadyEvent,
  SortChangedEvent,
  SortModelItem,
} from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { useCallback, useEffect, useRef, useState } from "react";
import { GridView, ColumnStateItem } from "@/shared/types";
import { supabaseGridStyles } from "./style";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function GridComponent<T>({
  tableName,
  columnDefs,
  apiEndpoint,
  activeView,
  onStateChange,
}: {
  tableName: "orders" | "invoices";
  columnDefs: ColDef[];
  activeView: GridView | null;
  onStateChange: (state: {
    columnState: ColumnStateItem[];
    filterModel: Record<string, unknown>;
    sortModel: SortModelItem[];
  }) => void;
  apiEndpoint: string;
}) {
  const gridRef = useRef<AgGridReact<T>>(null);
  const [rowData, setRowData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const buildQueryString = useCallback(
    (
      sortField?: string,
      sortDir?: string,
      filters?: Record<string, unknown>,
      pageSize?: number,
      page?: number,
    ) => {
      const params = new URLSearchParams();
      if (sortField) params.set("sortField", sortField);
      if (sortDir) params.set("sortDir", sortDir);
      if (filters && Object.keys(filters).length > 0) {
        params.set("filters", JSON.stringify(filters));
      }
      if (pageSize !== undefined) params.set("pageSize", pageSize.toString());
      if (page !== undefined) params.set("page", page.toString());
      return params.toString();
    },
    [],
  );

  const fetchData = useCallback(
    async (
      sortField?: string,
      sortDir?: string,
      filters?: Record<string, unknown>,
      size?: number,
      page?: number,
    ) => {
      setLoading(true);
      try {
        const qs = buildQueryString(
          sortField,
          sortDir,
          filters,
          size ?? pageSize,
          page ?? 0,
        );
        const res = await fetch(`${apiEndpoint}?${qs}`);
        const json = await res.json();
        setRowData(json.rows ?? []);
        setTotal(json.total ?? 0);
        setCurrentPage(page ?? 0);
      } finally {
        setLoading(false);
      }
    },
    [apiEndpoint, buildQueryString, pageSize],
  );

  // Initial fetch
  useEffect(() => {
    fetchData(undefined, undefined, undefined, pageSize, 0);
  }, [fetchData, pageSize]);

  // Apply view state when activeView changes (null = reset to defaults)
  useEffect(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    if (!activeView) {
      // Reset column visibility/order/sort to match the original columnDefs
      const defaultState = columnDefs.map((col) => ({
        colId: col.field as string,
        hide: col.hide ?? false,
        sort: null as null,
        sortIndex: null as null,
      }));
      api.applyColumnState({ state: defaultState, applyOrder: true });
      api.setFilterModel({});
      fetchData(undefined, undefined, undefined, pageSize, 0);
      return;
    }

    if (activeView.column_state) {
      api.applyColumnState({
        state: activeView.column_state as ColumnState[],
        applyOrder: true,
      });
    }

    const filterModel =
      (activeView.filter_model as Record<string, unknown>) ?? {};
    const sortModel = activeView.sort_model ?? [];

    const sortField =
      sortModel[0]?.colId ??
      activeView.column_state?.find((c) => c.sort)?.colId;
    const sortDir =
      sortModel[0]?.sort ?? activeView.column_state?.find((c) => c.sort)?.sort;

    api.setFilterModel(filterModel);
    fetchData(sortField, sortDir ?? undefined, filterModel);
  }, [activeView, fetchData, columnDefs, pageSize]);

  const emitStateChange = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api || !onStateChange) return;

    const colState = api.getColumnState() as ColumnStateItem[];
    const filterModel = api.getFilterModel() as Record<string, unknown>;
    const sortModel: SortModelItem[] = colState
      .filter((c) => c.sort)
      .sort((a, b) => (a.sortIndex ?? 0) - (b.sortIndex ?? 0))
      .map((c) => ({ colId: c.colId, sort: c.sort! }));

    onStateChange({ columnState: colState, filterModel, sortModel });
  }, [onStateChange]);

  const onGridReady = useCallback((_: GridReadyEvent) => {}, []);

  const getSortAndFilter = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return {};
    const colState = api.getColumnState();
    const sortedCol = colState.find((c) => c.sort);
    const filterModel = api.getFilterModel() as Record<string, unknown>;
    return {
      sortField: sortedCol?.colId,
      sortDir: sortedCol?.sort ?? undefined,
      filterModel,
    };
  }, []);

  const onSortChanged = useCallback(
    (_e: SortChangedEvent) => {
      const { sortField, sortDir, filterModel } = getSortAndFilter();
      fetchData(sortField, sortDir, filterModel, pageSize, 0);
      emitStateChange();
    },
    [fetchData, emitStateChange, getSortAndFilter, pageSize],
  );

  const onFilterChanged = useCallback(
    (_e: FilterChangedEvent) => {
      const { sortField, sortDir, filterModel } = getSortAndFilter();
      fetchData(sortField, sortDir, filterModel, pageSize, 0);
      emitStateChange();
    },
    [fetchData, emitStateChange, getSortAndFilter, pageSize],
  );

  const onColumnChanged = useCallback(() => {
    emitStateChange();
  }, [emitStateChange]);

  const goToPage = useCallback(
    (page: number) => {
      const { sortField, sortDir, filterModel } = getSortAndFilter();
      fetchData(sortField, sortDir, filterModel, pageSize, page);
    },
    [fetchData, getSortAndFilter, pageSize],
  );
  const startRow = total === 0 ? 0 : currentPage * pageSize + 1;
  const endRow = Math.min((currentPage + 1) * pageSize, total);

  return (
    <>
      <style>{supabaseGridStyles}</style>
      <div className="ag-theme-alpine supabase-grid w-full min-h-full h-[500px]">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 80,
          }}
          animateRows
          suppressMenuHide
          onGridReady={onGridReady}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          onColumnMoved={onColumnChanged as (e: ColumnMovedEvent) => void}
          onColumnResized={onColumnChanged as (e: ColumnResizedEvent) => void}
          suppressPaginationPanel
          overlayLoadingTemplate={
            '<span class="ag-overlay-loading-center">Loading data…</span>'
          }
          loading={loading}
          columnDefs={columnDefs}
        />
      </div>
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-background text-sm text-muted-foreground">
        <span>
          {total === 0 ? "No rows" : `${startRow}–${endRow} of ${total}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(0)}
            disabled={currentPage === 0 || loading}
            className="px-2 py-1 rounded disabled:opacity-40 hover:bg-muted"
          >
            «
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 0 || loading}
            className="px-2 py-1 rounded disabled:opacity-40 hover:bg-muted"
          >
            ‹
          </button>
          <span className="px-2">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-2 py-1 rounded disabled:opacity-40 hover:bg-muted"
          >
            ›
          </button>
          <button
            onClick={() => goToPage(totalPages - 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="px-2 py-1 rounded disabled:opacity-40 hover:bg-muted"
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}
