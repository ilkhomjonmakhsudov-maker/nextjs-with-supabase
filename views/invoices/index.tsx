"use client";
import {
  INVOICE_COLUMN_DEFS,
  INVOICE_DEFAULT_VISIBLE,
} from "@/views/invoices/model/model";
import GridPageClient from "@/components/ag-grid/GridPage";

export default function Invoices() {
  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <GridPageClient
        tableName="invoices"
        title="Invoices"
        defaultVisibleCols={INVOICE_DEFAULT_VISIBLE}
        apiEndpoint="/api/invoices"
        columnDefs={INVOICE_COLUMN_DEFS}
      />
    </div>
  );
}
