import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      colors: {
        status: {
          open: "#dc2626",       // אדום
          today: "#ea580c",      // כתום
          completed: "#16a34a",  // ירוק
          cancelled: "#6b7280",  // אפור
        },
      },
    },
  },
  plugins: [],
};

export default config;
