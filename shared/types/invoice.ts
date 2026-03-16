const InvoiceStatus = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;

interface Invoice {
  invoice_id: string;
  customer_name: string;
  customer_email: string;
  invoice_date: string;
  due_date: string;
  amount: number;
  tax: number;
  total: number;
  status: (typeof InvoiceStatus)[keyof typeof InvoiceStatus];
  payment_method: string | null;
  notes: string | null;
}

export type { Invoice, InvoiceStatus };
