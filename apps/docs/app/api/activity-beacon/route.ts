import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";

const BOT_USER_AGENT_PATTERN =
  /bot|crawler|spider|preview|lighthouse|pagespeed|slurp|facebookexternalhit|embedly|discord|slack|telegram|whatsapp|reddit/i;

const PATH_PATTERN = /^\/(?!\/)[^\\]*$/;
const COUNTRY_CODE_PATTERN = /^[A-Z]{2}$/;

const ACTIVITY_ENDPOINT = "https://educalvolopez.com/api/activity";

interface BeaconPayload {
  path: string;
  title?: string;
}

function isValidPayload(value: unknown): value is BeaconPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const { path, title } = value as Record<string, unknown>;

  if (
    typeof path !== "string" ||
    path.length > 500 ||
    !PATH_PATTERN.test(path)
  ) {
    return false;
  }

  if (
    title !== undefined &&
    (typeof title !== "string" || title.length > 500)
  ) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  const secret = process.env.ACTIVITY_INGEST_HMAC_SECRET;

  if (!secret) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_USER_AGENT_PATTERN.test(userAgent)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isValidPayload(payload)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { path, title } = payload;

  const rawCity = request.headers.get("x-vercel-ip-city");
  let city: string | undefined;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = undefined;
    }
  }

  const rawCountry = request.headers.get("x-vercel-ip-country");
  const country =
    rawCountry && COUNTRY_CODE_PATTERN.test(rawCountry)
      ? rawCountry
      : undefined;

  const region = request.headers.get("x-vercel-ip-country-region") ?? undefined;

  const body = JSON.stringify({
    idempotency_key: `smoothui:visit:${crypto.randomUUID()}`,
    meta: {
      path,
      ...(title ? { title } : {}),
      ...(city ? { city } : {}),
      ...(country ? { country } : {}),
      ...(region ? { region } : {}),
    },
    source: "smoothui",
    speed: "signal",
    type: "visit",
  });

  const signature = createHmac("sha256", secret).update(body).digest("hex");

  try {
    await fetch(ACTIVITY_ENDPOINT, {
      body,
      headers: {
        "Content-Type": "application/json",
        "x-activity-signature": signature,
      },
      method: "POST",
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Best-effort forward: never fail the response because the relay failed.
  }

  return NextResponse.json({ ok: true });
}
