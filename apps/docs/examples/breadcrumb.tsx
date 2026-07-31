"use client";

import Breadcrumb from "@repo/smoothui/components/breadcrumb";

const items = [
  { href: "#", label: "Home" },
  { href: "#", label: "Docs" },
  { href: "#", label: "Components" },
  { label: "Breadcrumb" },
];

export default function BreadcrumbDemo() {
  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb items={items} />

      <Breadcrumb
        items={[
          { href: "#", label: "Dashboard" },
          { href: "#", label: "Settings" },
          { label: "Profile" },
        ]}
      />

      <Breadcrumb
        items={[
          { href: "#", label: "Products" },
          { href: "#", label: "Electronics" },
          { href: "#", label: "Phones" },
          { label: "iPhone 16 Pro" },
        ]}
        separator={<span className="text-muted-foreground">/</span>}
      />
    </div>
  );
}
