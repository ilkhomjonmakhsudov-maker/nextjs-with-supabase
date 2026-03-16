"use client";
import { useState, useEffect, useCallback } from "react";
import { GridView, ColumnStateItem, SortModelItem } from "@/shared/types";
import axios from "axios";

export function useGridViews(tableName: "orders" | "invoices") {
  const [views, setViews] = useState<GridView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchViews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get<GridView[]>(
        `/api/views?table_name=${tableName}`,
      );
      setViews(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    fetchViews();
  }, [fetchViews]);

  const createView = async (payload: {
    name: string;
    column_state?: ColumnStateItem[];
    filter_model?: Record<string, unknown>;
    sort_model?: SortModelItem[];
    is_default?: boolean;
  }) => {
    const res = await axios.post<GridView>("/api/views", {
      ...payload,
      table_name: tableName,
    });
    setViews((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateView = async (id: string, updates: Partial<GridView>) => {
    const res = await axios.put<GridView>(`/api/views/${id}`, updates);
    setViews((prev) => prev.map((v) => (v.id === id ? res.data : v)));
    return res.data;
  };

  const deleteView = async (id: string) => {
    const res = await axios.delete<GridView>(`/api/views/${id}`);
    setViews((prev) => prev.filter((v) => v.id !== id));
    return res.data;
  };

  return {
    views,
    loading,
    error,
    fetchViews,
    createView,
    updateView,
    deleteView,
  };
}
