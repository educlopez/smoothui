import type { ApiErrorResponse } from "@smoothui/data";
import { NextResponse } from "next/server";

/** Common CORS headers applied to all v1 API responses */
export const corsHeaders = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
} as const;

const normalizePositiveInteger = (
  value: string | null,
  fallback: number
): number => {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  if (!(Number.isFinite(parsed) && Number.isInteger(parsed))) {
    return fallback;
  }

  return Math.max(1, parsed);
};

/** Parse tolerant, finite pagination metadata shared by catalog endpoints. */
export const parsePagination = (
  searchParams: URLSearchParams,
  defaultPageSize: number,
  maxPageSize: number
): { page: number; pageSize: number } => ({
  page: normalizePositiveInteger(searchParams.get("page"), 1),
  pageSize: Math.min(
    maxPageSize,
    normalizePositiveInteger(searchParams.get("pageSize"), defaultPageSize)
  ),
});

/** Return a JSON response with CORS headers */
export const jsonResponse = <T>(data: T, status = 200): NextResponse =>
  NextResponse.json(data, { headers: corsHeaders, status });

/** Return a standardised error response with CORS headers */
export const errorResponse = (
  error: string,
  status: number
): NextResponse<ApiErrorResponse> =>
  NextResponse.json({ error, status }, { headers: corsHeaders, status });

/** Handle CORS preflight */
export const OPTIONS = (): NextResponse =>
  new NextResponse(null, { headers: corsHeaders, status: 204 });
