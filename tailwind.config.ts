import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: {
          DEFAULT: "#13131c",
          hover: "#1b1b27",
          border: "#26263a",
        },
        accent: {
          DEFAULT: "#6366f1",
          muted: "#4338ca",
        },
        income: "#10b981",
        expense: "#ef4444",
        neutral: "#94a3b8",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
      },
    },
  },
  plugins: [],
};

export default config;
