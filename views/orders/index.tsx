"use client";
import {
  ORDER_COLUMN_DEFS,
  ORDER_DEFAULT_VISIBLE,
} from "@/views/orders/model/model";
import GridPageClient from "@/components/ag-grid/GridPage";
import AppLayout from "@/components/layout/AppLayout";

export default function Orders() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <GridPageClient
        tableName="orders"
        title="Orders"
        apiEndpoint="/api/orders"
        columnDefs={ORDER_COLUMN_DEFS}
        defaultVisibleCols={ORDER_DEFAULT_VISIBLE}
      />
    </div>
  );
}
