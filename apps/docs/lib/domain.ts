function getDomain(): string {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return "https://smoothui-monorepo.vercel.app";
  }
  if (process.env.VERCEL_BRANCH_URL) {
    return `https://${process.env.VERCEL_BRANCH_URL}`;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_DEVELOPMENT_URL) {
    return process.env.NEXT_PUBLIC_DEVELOPMENT_URL;
  }
  return "http://localhost:3000";
}

export const domain = getDomain();
