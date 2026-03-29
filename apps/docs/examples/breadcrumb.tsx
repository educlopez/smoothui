"use client";

import Breadcrumb from "@repo/smoothui/components/breadcrumb";

const items = [
  { label: "Home", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Components", href: "#" },
  { label: "Breadcrumb" },
];

export default function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={items} />

      <Breadcrumb
        items={[
          { label: "Dashboard", href: "#" },
          { label: "Settings", href: "#" },
          { label: "Profile" },
        ]}
      />

      <Breadcrumb
        items={[
          { label: "Products", href: "#" },
          { label: "Electronics", href: "#" },
          { label: "Phones", href: "#" },
          { label: "iPhone 16 Pro" },
        ]}
        separator={<span className="text-muted-foreground">/</span>}
      />
    </div>
  );
}
