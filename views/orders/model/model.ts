import {
  currencyFormatter,
  dateFormatter,
  percentFormatter,
  statusRenderer,
} from "@/lib/formatters";
import { Order } from "@/shared/types";
import { ColDef } from "ag-grid-community";

// ── Orders columns ───────────────────────────────────────────
export const ORDER_COLUMN_DEFS: ColDef<Order>[] = [
  {
    field: "order_id",
    headerName: "Order ID",
    pinned: "left",
    cellStyle: { fontFamily: "monospace", fontSize: "12px" },
  },
  {
    field: "customer_name",
    headerName: "Customer Name",
    filter: "agTextColumnFilter",
  },
  {
    field: "customer_phone",
    headerName: "Phone",
    hide: true,
  },
  {
    field: "order_date",
    headerName: "Order Date",
    filter: "agDateColumnFilter",
    valueFormatter: dateFormatter,
  },
  {
    field: "shipping_address",
    headerName: "Shipping Address",
    hide: true,
  },
  {
    field: "items_count",
    headerName: "Items",
    filter: "agNumberColumnFilter",
    type: "numericColumn",
  },
  {
    field: "subtotal",
    headerName: "Subtotal",
    hide: true,
    filter: "agNumberColumnFilter",
    type: "numericColumn",
    valueFormatter: currencyFormatter,
  },
  {
    field: "shipping_cost",
    headerName: "Shipping",
    hide: true,
    filter: "agNumberColumnFilter",
    type: "numericColumn",
    valueFormatter: currencyFormatter,
  },
  {
    field: "discount",
    headerName: "Discount",
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
    field: "tracking_number",
    headerName: "Tracking #",
    filter: "agTextColumnFilter",
    valueFormatter: (p) => p.value ?? "—",
  },
  {
    field: "estimated_delivery",
    headerName: "Est. Delivery",
    hide: true,
    filter: "agDateColumnFilter",
    valueFormatter: dateFormatter,
  },
];

export const ORDER_DEFAULT_VISIBLE = [
  "order_id",
  "customer_name",
  "order_date",
  "items_count",
  "total",
  "status",
  "tracking_number",
];
