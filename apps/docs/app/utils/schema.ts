export const smoothUISchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://smoothui.dev/#organization",
      name: "SmoothUI",
      url: "https://smoothui.dev",
      logo: {
        "@type": "ImageObject",
        url: "https://smoothui.dev/logo-smoothui.svg",
      },
      description:
        "Beautiful animated React components with smooth Motion and GSAP animations. Drop-in shadcn/ui compatible, fully customizable. 50+ free components with Tailwind CSS for modern UIs.",
      founder: {
        "@type": "Person",
        name: "Eduardo Calvo",
        sameAs: ["https://twitter.com/educalvolpz"],
      },
      sameAs: [
        "https://twitter.com/educalvolpz",
        "https://github.com/educlopez/smoothui",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://smoothui.dev/#software",
      name: "SmoothUI",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description:
        "A React component library featuring 50+ animated UI components with smooth Motion and GSAP animations. Compatible with shadcn/ui, built with Tailwind CSS v4 and TypeScript.",
      url: "https://smoothui.dev",
      author: {
        "@id": "https://smoothui.dev/#organization",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      programmingLanguage: ["TypeScript", "JavaScript"],
      runtimePlatform: "React",
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
    },
    {
      "@type": "WebSite",
      "@id": "https://smoothui.dev/#website",
      name: "SmoothUI",
      url: "https://smoothui.dev",
      publisher: {
        "@id": "https://smoothui.dev/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://smoothui.dev/docs/components?q={search_term}",
        },
        "query-input": "required name=search_term",
      },
    },
  ],
};
