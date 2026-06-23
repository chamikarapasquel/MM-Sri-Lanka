import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 Configuration for MM Sri Lanka
 *
 * NOTE: This project uses Tailwind CSS v4 with @tailwindcss/postcss.
 * In v4, the primary theming is done via @theme directives in globals.css.
 * This config file provides additional plugin support and acts as a
 * compatibility layer. The custom colors, fonts, and animations are
 * defined in src/app/globals.css using @theme inline blocks.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0e1a",
          800: "#0f1629",
          700: "#1a1f3a",
          600: "#252b4a",
        },
        electric: {
          blue: "#00d4ff",
          "blue-light": "#33ddff",
          "blue-dark": "#00a8cc",
        },
        neon: {
          green: "#00ff88",
          "green-light": "#33ffaa",
          "green-dark": "#00cc6a",
        },
        accent: {
          purple: "#7c3aed",
          "purple-light": "#8b5cf6",
          "purple-dark": "#6d28d9",
        },
        surface: {
          dark: "#111827",
          DEFAULT: "#1f2937",
          light: "#374151",
          lighter: "#4b5563",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 6s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.2), 0 0 10px rgba(0, 212, 255, 0.1)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "100": "25rem",
        "112": "28rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "cyber-grid":
          "linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "cyber-grid": "50px 50px",
      },
      boxShadow: {
        "glow-blue": "0 0 15px rgba(0, 212, 255, 0.3), 0 0 30px rgba(0, 212, 255, 0.1)",
        "glow-green": "0 0 15px rgba(0, 255, 136, 0.3), 0 0 30px rgba(0, 255, 136, 0.1)",
        "glow-purple": "0 0 15px rgba(124, 58, 237, 0.3), 0 0 30px rgba(124, 58, 237, 0.1)",
        "inner-glow": "inset 0 0 20px rgba(0, 212, 255, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
