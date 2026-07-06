import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--text-primary)",
        graphite: "var(--text-secondary)",
        mist: "var(--bg-secondary)",
        line: "var(--border-color)",
        steel: "var(--text-secondary)",
        signal: "var(--accent)",
        copper: "#c87537",
        marine: "var(--text-primary)",
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "border-primary": "var(--border-color)"
      },
      maxWidth: {
        "8xl": "1440px"
      },
      boxShadow: {
        premium: "0 24px 80px rgba(16, 19, 24, 0.14)",
        crisp: "0 10px 30px rgba(16, 19, 24, 0.08)"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "Sora", "system-ui", "sans-serif"]
      },
      fontSize: {
        hero: ["clamp(2.5rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "800" }],
        section: ["clamp(1.8rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        subtitle: ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2", fontWeight: "600" }],
        card: ["clamp(1.25rem, 2.5vw, 1.75rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "body-large": ["clamp(1rem, 0.5vw + 0.875rem, 1.125rem)", { lineHeight: "1.7", fontWeight: "400" }],
        "body-normal": ["clamp(0.95rem, 1.2vw, 1.1rem)", { lineHeight: "1.8", fontWeight: "400" }],
        "small-text": ["clamp(0.8125rem, 0.2vw + 0.75rem, 0.875rem)", { lineHeight: "1.6", fontWeight: "400" }]
      },
      transitionDuration: {
        "400": "400ms"
      }
    }
  },
  plugins: []
};

export default config;
