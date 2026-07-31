import { COMPONENT_COUNT } from "@docs/lib/generated/counts";

export const smoothUISchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": "https://smoothui.dev/#organization",
      "@type": "Organization",
      description: `Beautiful animated React components with smooth Motion and GSAP animations. Drop-in shadcn/ui compatible, fully customizable. ${COMPONENT_COUNT} free components with Tailwind CSS for modern UIs.`,
      founder: {
        "@type": "Person",
        name: "Eduardo Calvo",
        sameAs: ["https://twitter.com/educalvolpz"],
      },
      logo: {
        "@type": "ImageObject",
        url: "https://smoothui.dev/logo-smoothui.svg",
      },
      name: "SmoothUI",
      sameAs: [
        "https://twitter.com/educalvolpz",
        "https://github.com/educlopez/smoothui",
      ],
      url: "https://smoothui.dev",
    },
    {
      "@id": "https://smoothui.dev/#software",
      "@type": "SoftwareApplication",
      applicationCategory: "DeveloperApplication",
      author: {
        "@id": "https://smoothui.dev/#organization",
      },
      description: `A React component library featuring ${COMPONENT_COUNT} animated UI components with smooth Motion and GSAP animations. Compatible with shadcn/ui, built with Tailwind CSS v4 and TypeScript.`,
      keywords: [
        "react components",
        "tailwindcss ui",
        "motion animations",
        "framer motion",
        "gsap animations",
        "shadcn/ui",
        "shadcn ui components",
        "shadcn alternative",
        "react ui library",
        "animated ui components",
        "dark mode components",
      ],
      name: "SmoothUI",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      operatingSystem: "Any",
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: "React",
      url: "https://smoothui.dev",
    },
    {
      "@id": "https://smoothui.dev/#website",
      "@type": "WebSite",
      name: "SmoothUI",
      potentialAction: {
        "@type": "SearchAction",
        "query-input": "required name=search_term",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://smoothui.dev/docs/components?q={search_term}",
        },
      },
      publisher: {
        "@id": "https://smoothui.dev/#organization",
      },
      url: "https://smoothui.dev",
    },
  ],
};
