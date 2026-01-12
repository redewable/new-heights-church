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
        // Core Brand Colors
        gold: {
          DEFAULT: "#C5A059",
          50: "#F7F3EA",
          100: "#EFE7D5",
          200: "#E0CFAB",
          300: "#D4BD8B",
          400: "#CCAE6F",
          500: "#C5A059",
          600: "#B08A3D",
          700: "#8A6C30",
          800: "#644E23",
          900: "#3E3016",
        },
        bg: {
          DEFAULT: "#0A0A0A",
          secondary: "#111111",
          tertiary: "#1A1A1A",
          elevated: "#222222",
        },
        text: {
          primary: "#F5F5F5",
          secondary: "#A0A0A0",
          muted: "#666666",
        },
        // Semantic Colors
        success: {
          DEFAULT: "#2D5A3D",
          light: "#3D7A53",
        },
        warning: {
          DEFAULT: "#8B7355",
          light: "#A68B6A",
        },
        error: {
          DEFAULT: "#8B3D3D",
          light: "#A65353",
        },
        live: {
          DEFAULT: "#C53030",
          pulse: "#E53E3E",
        },
      },
      fontFamily: {
        heading: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        // Custom scale for premium feel
        "display-xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["2rem", { lineHeight: "1.25" }],
        "heading-lg": ["1.5rem", { lineHeight: "1.3" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.4" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "caption": ["0.75rem", { lineHeight: "1.4" }],
      },
      spacing: {
        // Premium spacing scale
        "section": "6rem",
        "section-lg": "8rem",
        "container-padding": "1.5rem",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        "gold-glow": "0 0 40px rgba(197, 160, 89, 0.15)",
        "gold-glow-strong": "0 0 60px rgba(197, 160, 89, 0.25)",
        "elevated": "0 8px 32px rgba(0, 0, 0, 0.4)",
        "elevated-lg": "0 16px 48px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "pulse-live": "pulseLive 2s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseLive: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-gold": "linear-gradient(135deg, #C5A059 0%, #E0CFAB 50%, #C5A059 100%)",
        "gradient-dark": "linear-gradient(180deg, #0A0A0A 0%, #111111 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
