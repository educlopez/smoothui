import { blogSource } from "@docs/lib/source";

export const revalidate = false;

export function GET() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = new Date(a.data.date as string);
    const dateB = new Date(b.data.date as string);
    return dateB.getTime() - dateA.getTime();
  });

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const date = new Date(post.data.date as string);
      return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>https://smoothui.dev${post.url}</link>
      <guid>https://smoothui.dev${post.url}</guid>
      <pubDate>${date.toUTCString()}</pubDate>
      <description><![CDATA[${post.data.description ?? ""}]]></description>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SmoothUI Blog</title>
    <link>https://smoothui.dev/blog</link>
    <description>Tutorials, tips, and case studies about building beautiful animated React components.</description>
    <language>en-us</language>
    <atom:link href="https://smoothui.dev/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
