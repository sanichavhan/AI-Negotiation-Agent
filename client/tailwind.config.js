/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // ─── Astral Architect Color Tokens ───────────────────────────
      colors: {
        background: "#12121d",

        surface: {
          DEFAULT:  "#12121d",
          dim:      "#12121d",
          low:      "#1b1a26",
          base:     "#1f1e2a",
          high:     "#292935",
          highest:  "#343440",
          bright:   "#383845",
          variant:  "#343440",
        },

        primary: {
          DEFAULT:  "#d2bbff",
          container:"#7c3aed",
          fixed:    "#eaddff",
          fixedDim: "#d2bbff",
          on:       "#3f008e",
          onContainer: "#ede0ff",
        },

        secondary: {
          DEFAULT:  "#4cd7f6",
          container:"#03b5d3",
          fixed:    "#acedff",
          fixedDim: "#4cd7f6",
          on:       "#003640",
          onContainer: "#00424e",
        },

        tertiary: {
          DEFAULT:  "#ecb2ff",
          container:"#a600e0",
          fixed:    "#f8d8ff",
          fixedDim: "#ecb2ff",
          on:       "#520071",
          onContainer: "#faddff",
        },

        outline: {
          DEFAULT:  "#958da1",
          variant:  "#4a4455",
        },

        // Semantic
        danger:   "#f43f5e",
        success:  "#10b981",
        warning:  "#f59e0b",

        "on-background":  "#e3e0f1",
        "on-surface":     "#e3e0f1",
        "on-surface-variant": "#ccc3d8",
        "inverse-surface": "#e3e0f1",
        "inverse-primary": "#732ee4",
      },

      // ─── Typography ──────────────────────────────────────────────
      fontFamily: {
        headline: ['"Space Grotesk"', "sans-serif"],
        body:     ["Inter", "sans-serif"],
        label:    ['"Space Grotesk"', "sans-serif"],
        mono:     ['"Courier New"',   "monospace"],
      },

      fontSize: {
        "display-lg": ["3.5rem",  { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "headline-lg":["2rem",    { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "headline-md":["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "headline-sm":["1.5rem",  { lineHeight: "1.3" }],
        "title-lg":   ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg":    ["1rem",    { lineHeight: "1.6" }],
        "body-md":    ["0.9375rem",{ lineHeight: "1.6" }],
        "label-lg":   ["0.875rem",{ lineHeight: "1.4", letterSpacing: "0.05em" }],
        "label-md":   ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.05em" }],
      },

      // ─── Spacing Scale ───────────────────────────────────────────
      spacing: {
        "4.5":  "1.125rem",
        "13":   "3.25rem",
        "15":   "3.75rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "34":   "8.5rem",
        "88":   "22rem",
        "100":  "25rem",
        "112":  "28rem",
        "128":  "32rem",
      },

      // ─── Border Radius ───────────────────────────────────────────
      borderRadius: {
        "xs":  "0.25rem",  // 4px  – buttons, chips
        "sm":  "0.375rem", // 6px
        "md":  "0.5rem",   // 8px  – inputs
        "lg":  "0.75rem",  // 12px – cards
        "xl":  "1rem",     // 16px – large cards
        "2xl": "1.25rem",  // 20px – hero sections
        "3xl": "1.5rem",   // 24px – modal panels
        "4xl": "2rem",     // 32px
      },

      // ─── Gradients ───────────────────────────────────────────────
      backgroundImage: {
        "astral-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
        "astral-gradient-v":
          "linear-gradient(180deg, #7c3aed 0%, #06b6d4 100%)",
        "violet-fade":
          "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        "cyan-fade":
          "linear-gradient(135deg, #06b6d4 0%, #4cd7f6 100%)",
        "dark-gradient":
          "linear-gradient(180deg, #12121d 0%, #0d0d18 100%)",
        "surface-gradient":
          "linear-gradient(180deg, #1f1e2a 0%, #12121d 100%)",
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6,182,212,0.12) 0%, transparent 50%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 100%)",
        "violet-orb":
          "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
        "cyan-orb":
          "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",
        "gold-glow":
          "linear-gradient(90deg, rgba(251,191,36,0.8) 0%, rgba(251,191,36,0) 100%)",
        "silver-glow":
          "linear-gradient(90deg, rgba(148,163,184,0.8) 0%, rgba(148,163,184,0) 100%)",
        "bronze-glow":
          "linear-gradient(90deg, rgba(180,120,60,0.8) 0%, rgba(180,120,60,0) 100%)",
      },

      // ─── Box Shadows ─────────────────────────────────────────────
      boxShadow: {
        "violet-bloom":  "0 0 40px rgba(124, 58, 237, 0.15)",
        "violet-glow":   "0 0 20px rgba(124, 58, 237, 0.35)",
        "violet-intense":"0 0 30px rgba(124, 58, 237, 0.5)",
        "cyan-glow":     "0 0 20px rgba(6, 182, 212, 0.3)",
        "cyan-bloom":    "0 0 40px rgba(6, 182, 212, 0.12)",
        "primary-glow":  "0 0 15px rgba(210, 187, 255, 0.25)",
        "card-float":    "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(124, 58, 237, 0.06)",
        "card-hover":    "0 12px 48px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.12)",
        "btn-primary":   "0 0 20px rgba(124, 58, 237, 0.4)",
        "btn-primary-hover": "0 4px 24px rgba(124, 58, 237, 0.5)",
        "glass":         "inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.3)",
        "input-focus":   "0 0 0 3px rgba(6, 182, 212, 0.15)",
        "gold-rank":     "inset 3px 0 0 #fbbf24",
        "silver-rank":   "inset 3px 0 0 #94a3b8",
        "bronze-rank":   "inset 3px 0 0 #b47c3c",
      },

      // ─── Backdrop Blur ───────────────────────────────────────────
      backdropBlur: {
        "xs":    "4px",
        "glass": "16px",
        "heavy": "24px",
        "ultra": "40px",
      },

      // ─── Keyframe Animations ─────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(-30px) rotate(5deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(124,58,237,0.6)" },
        },
        "pulse-cyan": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(6,182,212,0.25)" },
          "50%":      { boxShadow: "0 0 35px rgba(6,182,212,0.55)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "slide-up": {
          "0%":   { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "30%":           { opacity: "1",   transform: "scale(1)" },
        },
        "count-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "border-spin": {
          "0%":   { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        "leverage-fill": {
          "0%":   { width: "0%" },
          "100%": { width: "var(--leverage-width, 65%)" },
        },
      },

      // ─── Animation Utilities ─────────────────────────────────────
      animation: {
        "fade-in":       "fade-in 0.4s ease forwards",
        "fade-in-up":    "fade-in-up 0.5s ease forwards",
        "fade-in-left":  "fade-in-left 0.4s ease forwards",
        "fade-in-right": "fade-in-right 0.4s ease forwards",
        "float":         "float 8s ease-in-out infinite",
        "float-slow":    "float-slow 12s ease-in-out infinite",
        "pulse-glow":    "pulse-glow 2.5s ease-in-out infinite",
        "pulse-cyan":    "pulse-cyan 2.5s ease-in-out infinite",
        "shimmer":       "shimmer 2.5s linear infinite",
        "slide-up":      "slide-up 0.5s ease forwards",
        "scale-in":      "scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "typing-dot":    "typing-dot 1.2s ease-in-out infinite",
        "count-up":      "count-up 0.6s ease forwards",
        "leverage-fill": "leverage-fill 0.8s cubic-bezier(0.34,1.1,0.64,1) forwards",
      },

      // ─── Transition Timing ───────────────────────────────────────
      transitionTimingFunction: {
        "spring":   "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth":   "cubic-bezier(0.4, 0, 0.2, 1)",
        "snappy":   "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },

      // ─── Z-Index Scale ───────────────────────────────────────────
      zIndex: {
        "60":  "60",
        "70":  "70",
        "80":  "80",
        "90":  "90",
        "100": "100",
      },
    },
  },
  plugins: [],
}
