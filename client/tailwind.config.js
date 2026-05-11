// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [require("daisyui")],
//   daisyui: {
//     themes: [
//       {
//         light: {
//           primary: "#7480FF",
//           "primary-content": "#FFFFFF",
//           secondary: "#0EA5E9",
//           "secondary-content": "#FFFFFF",
//           accent: "#22C55E",
//           "accent-content": "#052E16",
//           neutral: "#0F172A",
//           "neutral-content": "#F8FAFC",
//           "base-100": "#FFFFFF",
//           // Slight blue-violet tint to match brand, with stronger borders
//           "base-200": "#EEF2FF",
//           "base-300": "#C7D2FE",
//           "base-content": "#0B1020",
//           info: "#0284C7",
//           "info-content": "#FFFFFF",
//           success: "#16A34A",
//           "success-content": "#FFFFFF",
//           warning: "#8B5CF6",
//           "warning-content": "#FFFFFF",
//           error: "#DC2626",
//           "error-content": "#FFFFFF",
//         },
//       },
//       {
//         dark: {
//           primary: "#7480FF",
//           "primary-content": "#0B1020",
//           secondary: "#22D3EE",
//           "secondary-content": "#042F2E",
//           accent: "#A78BFA",
//           "accent-content": "#120A2A",
//           neutral: "#111827",
//           "neutral-content": "#E5E7EB",
//           "base-100": "#070A12",
//           "base-200": "#0B1020",
//           "base-300": "#0F172A",
//           "base-content": "#E5E7EB",
//           info: "#60A5FA",
//           "info-content": "#0B1020",
//           success: "#34D399",
//           "success-content": "#042F2E",
//           warning: "#FBBF24",
//           "warning-content": "#1F1400",
//           error: "#FB7185",
//           "error-content": "#2B0A12",
//         },
//       },
//       "cupcake",
//     ],
//   },
// };
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
      },
    },
  },

  plugins: [daisyui],

  daisyui: {
    themes: [
      {
        light: {
          // PRIMARY BRAND COLORS
          primary: "#7480FF",
          "primary-content": "#FFFFFF",

          secondary: "#8B5CF6",
          "secondary-content": "#FFFFFF",

          accent: "#06B6D4",
          "accent-content": "#FFFFFF",

          // NEUTRAL
          neutral: "#1E293B",
          "neutral-content": "#F8FAFC",

          // BASE COLORS (slightly darker light mode)
          "base-100": "#EEF2FF",
          "base-200": "#E6EBF8",
          "base-300": "#CBD5E1",

          // TEXT
          "base-content": "#0B1020",

          // STATUS COLORS
          info: "#3B82F6",
          "info-content": "#FFFFFF",

          success: "#10B981",
          "success-content": "#FFFFFF",

          warning: "#8B5CF6",
          "warning-content": "#FFFFFF",

          error: "#EF4444",
          "error-content": "#FFFFFF",
        },
      },

      {
        dark: {
          primary: "#818CF8",
          "primary-content": "#0F172A",

          secondary: "#A78BFA",
          "secondary-content": "#140F2D",

          accent: "#22D3EE",
          "accent-content": "#042F2E",

          neutral: "#0F172A",
          "neutral-content": "#E2E8F0",

          "base-100": "#020617",
          "base-200": "#0F172A",
          "base-300": "#1E293B",

          "base-content": "#F1F5F9",

          info: "#60A5FA",
          "info-content": "#0F172A",

          success: "#34D399",
          "success-content": "#042F2E",

          warning: "#FBBF24",
          "warning-content": "#1F1400",

          error: "#FB7185",
          "error-content": "#2B0A12",
        },
      },
    ],
  },
};
