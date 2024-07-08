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
      colors: {
        dark1: "hsl(0 0% 8.5%)",
        dark2: "hsl(0 0% 11.0%)",
        dark3: "hsl(0 0% 13.6%)",
        dark4: "hsl(0 0% 15.8%)",
        dark11: "hsl(0 0% 62.8%)",
        dark12: "hsl(0 0% 93.0%)",
        light1: "hsl(0 0% 99.0%)",
        light2: "hsl(0 0% 97.3%)",
        light3: "hsl(0 0% 95.1%)",
        light4: "hsl(0 0% 93.0%)",
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
