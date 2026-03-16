import { ValueFormatterParams } from "ag-grid-community";

// ── Shared formatters ────────────────────────────────────────
export const currencyFormatter = (p: ValueFormatterParams) =>
  p.value != null
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(p.value)
    : "—";

export const percentFormatter = (p: ValueFormatterParams) =>
  p.value != null ? `${p.value}%` : "—";

export const dateFormatter = (p: ValueFormatterParams) =>
  p.value
    ? new Date(p.value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

// ── Status badge renderer (inline HTML) ─────────────────────
export const STATUS_COLORS: Record<string, string> = {
  // orders
  pending: "#f59e0b",
  confirmed: "#6366f1",
  processing: "#3b82f6",
  delivered: "#10b981",
  // invoices
  draft: "#6b7280",
  sent: "#6366f1",
  paid: "#10b981",
  overdue: "#ef4444",
  cancelled: "#6b7280",
};

export const statusRenderer = (p: { value: string }) => {
  const color = STATUS_COLORS[p.value] ?? "#6b7280";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        background: `${color}22`,
        color: color,
        textTransform: "capitalize",
      }}
    >
      {p.value}
    </span>
  );
};
