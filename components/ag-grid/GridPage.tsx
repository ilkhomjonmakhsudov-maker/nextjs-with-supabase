"use client";
import { useState, useCallback, useRef, useMemo } from "react";
import { ColDef } from "ag-grid-community";
import ViewManager from "@/components/viewManager/ViewManager";
import { useGridViews } from "@/hooks/useGridViews";
import { GridView, ColumnStateItem, SortModelItem } from "@/shared/types";
import GridComponent from "./GridComponent";

interface GridPageClientProps {
  tableName: "orders" | "invoices";
  title: string;
  columnDefs: ColDef[];
  defaultVisibleCols: string[];
  apiEndpoint: string;
}

export default function GridPageClient({
  tableName,
  title,
  columnDefs,
  defaultVisibleCols,
  apiEndpoint,
}: GridPageClientProps) {
  const { views, loading, createView, updateView, deleteView } =
    useGridViews(tableName);

  const [activeView, setActiveView] = useState<GridView | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const currentStateRef = useRef<{
    columnState: ColumnStateItem[];
    filterModel: Record<string, unknown>;
    sortModel: SortModelItem[];
  }>({ columnState: [], filterModel: {}, sortModel: [] });

  const handleStateChange = useCallback(
    (state: {
      columnState: ColumnStateItem[];
      filterModel: Record<string, unknown>;
      sortModel: SortModelItem[];
    }) => {
      currentStateRef.current = state;
      // Mark dirty only if a view is active
      if (activeView) setHasUnsavedChanges(true);
    },
    [activeView],
  );

  const handleSelectView = (view: GridView | null) => {
    setActiveView(view);
    setHasUnsavedChanges(false);
  };

  const handleCreateView = async (name: string) => {
    const { columnState, filterModel, sortModel } = currentStateRef.current;
    const newView = await createView({
      name,
      column_state: columnState,
      filter_model: filterModel,
      sort_model: sortModel,
    });
    setActiveView(newView);
    setHasUnsavedChanges(false);
  };

  const handleSaveView = async () => {
    if (!activeView) return;
    const { columnState, filterModel, sortModel } = currentStateRef.current;
    await updateView(activeView.id, {
      column_state: columnState,
      filter_model: filterModel,
      sort_model: sortModel,
    });
    setHasUnsavedChanges(false);
  };

  const handleDeleteView = async (id: string) => {
    await deleteView(id);
    if (activeView?.id === id) {
      setActiveView(null);
      setHasUnsavedChanges(false);
    }
  };

  const handleResetDefault = () => {
    setActiveView(null);
    setHasUnsavedChanges(false);
    currentStateRef.current = {
      columnState: [],
      filterModel: {},
      sortModel: [],
    };
  };

  // Build column defs applying default visibility
  const enrichedColDefs = useMemo<ColDef[]>(
    () =>
      columnDefs.map((col) => ({
        ...col,
        hide:
          col.hide !== undefined
            ? col.hide
            : !defaultVisibleCols.includes(col.field as string),
      })),
    [columnDefs, defaultVisibleCols],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        <p className="text-xs text-white/30 mt-0.5">
          {views.length} saved view{views.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* View toolbar */}
      <ViewManager
        tableName={tableName}
        views={views}
        activeView={activeView}
        hasUnsavedChanges={hasUnsavedChanges}
        currentState={currentStateRef.current}
        onSelectView={handleSelectView}
        onCreateView={handleCreateView}
        onSaveView={handleSaveView}
        onDeleteView={handleDeleteView}
        onResetDefault={handleResetDefault}
        loading={loading}
      />

      {/* Grid */}
      <div className="flex-1 min-h-0 p-4">
        <GridComponent
          tableName={tableName}
          columnDefs={enrichedColDefs}
          apiEndpoint={apiEndpoint}
          activeView={activeView}
          onStateChange={handleStateChange}
        />
      </div>
    </div>
  );
}
