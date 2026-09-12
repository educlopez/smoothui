import { redirect } from "next/navigation";

export default async function ThemesRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        query.append(key, item);
      }
    } else if (value !== undefined) {
      query.set(key, value);
    }
  }
  const suffix = query.toString();
  redirect(`/playground${suffix ? `?${suffix}` : ""}`);
}
