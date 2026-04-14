import type { ApiErrorResponse } from "@smoothui/data";
import { NextResponse } from "next/server";

/** Common CORS headers applied to all v1 API responses */
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

/** Return a JSON response with CORS headers */
export const jsonResponse = <T>(data: T, status = 200): NextResponse =>
  NextResponse.json(data, { status, headers: corsHeaders });

/** Return a standardised error response with CORS headers */
export const errorResponse = (
  error: string,
  status: number
): NextResponse<ApiErrorResponse> =>
  NextResponse.json({ error, status }, { status, headers: corsHeaders });

/** Handle CORS preflight */
export const OPTIONS = (): NextResponse =>
  new NextResponse(null, { status: 204, headers: corsHeaders });
