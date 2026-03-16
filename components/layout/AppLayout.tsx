"use client";
import Link from "next/link";
import { Suspense } from "react";
import { FileText, LayoutDashboard, Loader2, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LogoutButton } from "../logout-button";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col   items-center">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-end items-center p-3 px-5 text-sm">
            <Suspense
              fallback={
                <span className="text-white/30 text-sm flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Loading...
                </span>
              }
            >
              <div className="flex items-center gap-4">
                {user?.email && `Hey, ${user?.email}!`}
                <LogoutButton />
              </div>
            </Suspense>
          </div>
        </nav>
        <div className="flex-1 w-full flex h-screen">
          <aside className="flex-1 p-3 space-y-0.5">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-accent/15 text-accent-bright font-medium"
                      : "text-white/50 hover:text-white/80 hover:bg-surface-3"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </aside>
          <div className="p-2 w-full h-full">{children}</div>
        </div>
      </div>
    </main>
  );
}
