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
          accent: "#1e40af",
          "base-100": "#002233",
        },
      },
      {
        customlight: {
          primary: "#0891b2",
          secondary: "#164e63",
          accent: "#1e40af",
          "base-100": "#ffffff",
        },
      },
    ],
  },
} satisfies Config;
