import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#002233",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        customdark: {
          primary: "#0891b2",
          secondary: "#164e63",
          accent: "#22d3ee",
          "base-100": "#002233",
          "base-200": "#ffffff",
          "base-300": "black",
        },
      },
      {
        customlight: {
          primary: "#06b6d4",
          secondary: "#164e63",
          accent: "#22d3ee",
          "base-100": "#f5f5f5",
          "base-200": "#002233",
          "base-300": "white",
        },
      },
    ],
  },
} satisfies Config;
