import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const buildQueryString = (
  sortField?: string,
  sortDir?: string,
  filters?: Record<string, unknown>,
  page?: number,
  pageSize?: number,
) => {
  const params = new URLSearchParams();
  if (sortField) params.set("sortField", sortField);
  if (sortDir) params.set("sortDir", sortDir);
  if (filters && Object.keys(filters).length > 0) {
    params.set("filters", JSON.stringify(filters));
  }
  if (page) params.set("page", page.toString());
  if (pageSize) params.set("pageSize", pageSize.toString());
  return params.toString();
};

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
