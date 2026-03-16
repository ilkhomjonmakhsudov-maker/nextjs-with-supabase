"use server";
import Dashboard from "@/views/dashboard";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <Dashboard />
    </Suspense>
  );
}
