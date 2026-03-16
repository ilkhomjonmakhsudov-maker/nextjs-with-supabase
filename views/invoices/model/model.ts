import {
  currencyFormatter,
  dateFormatter,
  percentFormatter,
  statusRenderer,
} from "@/lib/formatters";
import { Invoice } from "@/shared/types";
import { ColDef } from "ag-grid-community";

// ── Invoices columns ─────────────────────────────────────────
export const INVOICE_COLUMN_DEFS: ColDef<Invoice>[] = [
  {
    field: "invoice_id",
    headerName: "Invoice ID",
    pinned: "left",
    cellStyle: { fontFamily: "monospace", fontSize: "12px" },
  },
  {
    field: "customer_name",
    headerName: "Customer Name",
    filter: "agTextColumnFilter",
  },
  {
    field: "customer_email",
    headerName: "Email",
    hide: true,
    filter: "agTextColumnFilter",
  },
  {
    field: "invoice_date",
    headerName: "Invoice Date",

    filter: "agDateColumnFilter",
    valueFormatter: dateFormatter,
  },
  {
    field: "due_date",
    headerName: "Due Date",

    filter: "agDateColumnFilter",
    valueFormatter: dateFormatter,
  },
  {
    field: "amount",
    headerName: "Amount",
    hide: true,
    filter: "agNumberColumnFilter",
    type: "numericColumn",
    valueFormatter: currencyFormatter,
  },
  {
    field: "tax",
    headerName: "Tax",
    hide: true,
    filter: "agNumberColumnFilter",
    type: "numericColumn",
    valueFormatter: percentFormatter,
  },
  {
    field: "total",
    headerName: "Total",
    filter: "agNumberColumnFilter",
    type: "numericColumn",
    valueFormatter: currencyFormatter,
    cellStyle: { fontWeight: "600" },
  },
  {
    field: "status",
    headerName: "Status",
    filter: "agTextColumnFilter",
    cellRenderer: statusRenderer,
  },
  {
    field: "payment_method",
    headerName: "Payment Method",
    hide: true,
    filter: "agTextColumnFilter",
    valueFormatter: (p) => p.value ?? "—",
  },
  {
    field: "notes",
    headerName: "Notes",
    hide: true,
    valueFormatter: (p) => p.value ?? "—",
  },
];

export const INVOICE_DEFAULT_VISIBLE = [
  "invoice_id",
  "customer_name",
  "invoice_date",
  "due_date",
  "total",
  "status",
];
