const OrderStatus = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  DELIVERED: "delivered",
} as const;

interface Order {
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  shipping_address: string;
  items_count: number;
  subtotal: number;
  shipping_cost: number;
  discount: number;
  total: number;
  status: (typeof OrderStatus)[keyof typeof OrderStatus];
  tracking_number: string | null;
  estimated_delivery: string | null;
}

export type { Order };
