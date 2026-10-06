import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050713",
        foreground: "#f3f4f6",
        cyber: {
          dark: "#050713",
          card: "rgba(13, 19, 43, 0.65)",
          cardHover: "rgba(22, 32, 70, 0.8)",
          cyan: "#00f0ff",
          purple: "#9d4edd",
          magenta: "#f72585",
          blue: "#3a86ff",
          gold: "#ffbe0b",
          green: "#06d6a0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15) 0%, rgba(157, 78, 221, 0.12) 35%, transparent 70%)",
      },
      animation: {
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "radar-sweep": "radarSweep 4s linear infinite",
        "border-glow": "borderGlow 4s linear infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        glowPulse: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(0, 240, 255, 0.3), 0 0 30px rgba(157, 78, 221, 0.2)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(0, 240, 255, 0.6), 0 0 50px rgba(157, 78, 221, 0.4)",
          },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        radarSweep: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      boxShadow: {
        neonCyan: "0 0 20px -3px rgba(0, 240, 255, 0.5), 0 0 8px -2px rgba(0, 240, 255, 0.4)",
        neonPurple: "0 0 20px -3px rgba(157, 78, 221, 0.5), 0 0 8px -2px rgba(157, 78, 221, 0.4)",
        neonGold: "0 0 20px -3px rgba(255, 190, 11, 0.5), 0 0 8px -2px rgba(255, 190, 11, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
