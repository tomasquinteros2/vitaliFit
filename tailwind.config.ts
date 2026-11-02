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
        'neon-green': '#1a7a4a',   // verde oscuro profesional
        'brand-green': '#f6c135',
        'brand-yellow': '#154c39',
        'brand-yellow-light': '#336a0a',
        'neon-orange': '#ff6600',
        'zinc-900': '#18181b',
        'zinc-800': '#27272a',
        'brand-white' : '#f5f5f5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        'none': '0px',
      },
    },
  },
  plugins: [],
};
export default config;
