"use client";

import type { Country } from "@repo/smoothui/components/country-dialog";
import CountryDialog from "@repo/smoothui/components/country-dialog";
import { useState } from "react";

const COUNTRIES: Country[] = [
  { code: "US", dialCode: "+1", group: "Americas", name: "United States" },
  { code: "CA", dialCode: "+1", group: "Americas", name: "Canada" },
  { code: "MX", dialCode: "+52", group: "Americas", name: "Mexico" },
  { code: "BR", dialCode: "+55", group: "Americas", name: "Brazil" },
  { code: "AR", dialCode: "+54", group: "Americas", name: "Argentina" },
  { code: "GB", dialCode: "+44", group: "Europe", name: "United Kingdom" },
  { code: "FR", dialCode: "+33", group: "Europe", name: "France" },
  { code: "DE", dialCode: "+49", group: "Europe", name: "Germany" },
  { code: "ES", dialCode: "+34", group: "Europe", name: "Spain" },
  { code: "IT", dialCode: "+39", group: "Europe", name: "Italy" },
  { code: "PT", dialCode: "+351", group: "Europe", name: "Portugal" },
  { code: "JP", dialCode: "+81", group: "Asia", name: "Japan" },
  { code: "KR", dialCode: "+82", group: "Asia", name: "South Korea" },
  { code: "CN", dialCode: "+86", group: "Asia", name: "China" },
  { code: "IN", dialCode: "+91", group: "Asia", name: "India" },
  { code: "SG", dialCode: "+65", group: "Asia", name: "Singapore" },
  { code: "AU", dialCode: "+61", group: "Oceania", name: "Australia" },
  { code: "NZ", dialCode: "+64", group: "Oceania", name: "New Zealand" },
  { code: "ZA", dialCode: "+27", group: "Africa", name: "South Africa" },
  { code: "EG", dialCode: "+20", group: "Africa", name: "Egypt" },
];

export default function CountryDialogDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("FR");

  const selected = COUNTRIES.find((country) => country.code === value);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-3 px-4 py-8">
      <CountryDialog
        countries={COUNTRIES}
        emptyMessage="No matching countries"
        groupBy
        onOpenChange={setOpen}
        onValueChange={setValue}
        open={open}
        placeholder="Search by name, code or dial code..."
        recent={["FR", "US", "JP"]}
        trigger={
          selected ? (
            <span className="flex items-center gap-2">
              <span aria-hidden="true">
                {String.fromCodePoint(
                  0x1_f1_e6 + (selected.code.charCodeAt(0) - 65),
                  0x1_f1_e6 + (selected.code.charCodeAt(1) - 65)
                )}
              </span>
              <span>{selected.name}</span>
              <span className="text-muted-foreground">{selected.dialCode}</span>
            </span>
          ) : (
            "Select country"
          )
        }
        value={value}
      />
      <p className="text-muted-foreground text-xs">
        Selected code: <span className="font-medium">{value}</span>
      </p>
    </div>
  );
}
