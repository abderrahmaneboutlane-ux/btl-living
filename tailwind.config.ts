import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        porcelain: "#F7F4EE",
        plaster: "#EDE6DB",
        linen: "#E1D7C8",
        oak: "#C9A87C",
        parquet: "#8A6440",
        cognac: "#9A5B32",
        bronze: "#8A6A45",
        stone: "#8B8177",
        espresso: "#1A1512",
        ink: "#231C17",
      },
      fontFamily: {
        display: ["var(--font-display)", "Bodoni Moda", "Didot", "serif"],
        sans: ["var(--font-sans)", "Jost", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.38em",
        wide2: "0.22em",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};

export default config;