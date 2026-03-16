import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FilterCondition } from "@/shared/types";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const sortField = searchParams.get("sortField") || "invoice_date";
  const sortDir = searchParams.get("sortDir") === "asc" ? true : false;
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "50");
  const filtersRaw = searchParams.get("filters");

  let query = supabase.from("invoices").select("*", { count: "exact" });

  if (filtersRaw) {
    try {
      const filters: Record<string, FilterCondition> = JSON.parse(filtersRaw);
      for (const [field, condition] of Object.entries(filters)) {
        if (condition.filterType === "text") {
          switch (condition.type) {
            case "contains":
              query = query.ilike(field, `%${condition.filter}%`);
              break;
            case "startsWith":
              query = query.ilike(field, `${condition.filter}%`);
              break;
            case "endsWith":
              query = query.ilike(field, `%${condition.filter}`);
              break;
            case "equals":
              query = query.eq(field, condition.filter as string);
              break;
            case "notEqual":
              query = query.neq(field, condition.filter as string);
              break;
          }
        } else if (condition.filterType === "number") {
          switch (condition.type) {
            case "equals":
              query = query.eq(field, condition.filter as number);
              break;
            case "greaterThan":
              query = query.gt(field, condition.filter as number);
              break;
            case "lessThan":
              query = query.lt(field, condition.filter as number);
              break;
            case "inRange":
              query = query
                .gte(field, condition.filter as number)
                .lte(field, condition.filterTo as number);
              break;
          }
        } else if (condition.filterType === "date") {
          switch (condition.type) {
            case "equals":
              query = query.eq(field, condition.dateFrom!);
              break;
            case "greaterThan":
              query = query.gt(field, condition.dateFrom!);
              break;
            case "lessThan":
              query = query.lt(field, condition.dateFrom!);
              break;
            case "inRange":
              query = query
                .gte(field, condition.dateFrom!)
                .lte(field, condition.dateTo!);
              break;
          }
        }
      }
    } catch {}
  }

  query = query.order(sortField, { ascending: sortDir });

  const from = page * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ rows: data, total: count ?? 0, page, pageSize });
}
