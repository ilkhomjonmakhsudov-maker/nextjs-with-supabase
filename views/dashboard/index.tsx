import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

import { FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();
  //   const { data } = await supabase.auth.getUser();
  const [{ count: orderCount }, { count: invoiceCount }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("invoices").select("*", { count: "exact", head: true }),
  ]);
  const cards = [
    {
      href: "/orders",
      label: "Orders",
      count: orderCount,
      icon: ShoppingCart,
      description: "Manage and filter order records",
      color: "#6366f1",
    },
    {
      href: "/invoices",
      label: "Invoices",
      count: invoiceCount,
      icon: FileText,
      description: "Track invoices and payment status",
      color: "#10b981",
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link href={card.href} key={card.label}>
            <Card
              key={card.label}
              className="group block cursor-pointer bg-surface-2 border border-border hover:border-border-bright rounded-2xl p-6 transition-all hover:bg-surface-3"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {card.icon && (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${card.color}20` }}
                    >
                      <card.icon size={18} style={{ color: card.color }} />
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-2xl font-bold text-primary">
                  {card.count}
                </CardDescription>
                <CardDescription className="text-lg font-bold text-primary">
                  {card.label}
                </CardDescription>
                <CardDescription className="text-sm text-muted-foreground">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
