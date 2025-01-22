import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-inter)"],
        title: ["var(--font-asap)"],
      },

      boxShadow: {
        custom:
          "inset 0 0 0 1px hsla(0, 0%, 100%, 0.04), 0 0 0 1px hsla(0, 0%, 0%, 0.15), 0px 40px 11px rgba(136, 97, 46, 0.01), 0px 26px 10px rgba(136, 97, 46, 0.05), 0px 14px 9px rgba(136, 97, 46, 0.17), 0px 6px 6px rgba(136, 97, 46, 0.29), 0px 2px 4px rgba(136, 97, 46, 0.33)",
      },
      colors: {
        dark1: "hsl(0 0% 8.5%)",
        dark2: "hsl(0 0% 11.0%)",
        dark3: "hsl(0 0% 13.6%)",
        dark4: "hsl(0 0% 15.8%)",
        dark5: "hsl(0 0% 17.9%)",
        dark6: "hsl(0 0% 20.5%)",
        dark7: "hsl(0 0% 24.3%)",
        dark8: "hsl(0 0% 31.2%)",
        dark9: "hsl(0 0% 43.9%)",
        dark10: "hsl(0 0% 49.4%)",
        dark11: "hsl(0 0% 62.8%)",
        dark12: "hsl(0 0% 93.0%)",
        light1: "hsl(0 0% 99.0%)",
        light2: "hsl(0 0% 97.3%)",
        light3: "hsl(0 0% 95.1%)",
        light4: "hsl(0 0% 93.0%)",
        light5: "hsl(0 0% 90.9%)",
        light6: "hsl(0 0% 88.3%)",
        light7: "hsl(0 0% 84.5%)",
        light8: "hsl(0 0% 77.6%)",
        light9: "hsl(0 0% 65.9%)",
        light10: "hsl(0 0% 60.4%)",
        light11: "hsl(0 0% 43.5%)",
        light12: "hsl(0 0% 9.0%)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
}
export default config
