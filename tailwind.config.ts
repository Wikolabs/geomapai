import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Montserrat'", "sans-serif"],
        body: ["'Open Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
