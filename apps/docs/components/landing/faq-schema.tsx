import { faqSchema } from "@docs/components/landing/faqs-data";
import Script from "next/script";

/**
 * FAQ JSON-LD via next/script. A plain `<script>` under fumadocs'
 * client `RootProvider` triggers React 19's "Encountered a script tag"
 * warning during hydration.
 */
export function FaqSchema() {
  return (
    <Script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Schema.org JSON-LD structured data requires innerHTML
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema),
      }}
      id="faq-schema"
      type="application/ld+json"
    />
  );
}
