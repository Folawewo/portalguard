export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#06080d",
        surface: "#0c101a",
        surfaceBorder: "rgba(255, 255, 255, 0.08)",
        cyberCyan: "#00f5ff",
        cyberPurple: "#8b5cf6",
        cyberPink: "#ec4899",
        cyberGreen: "#10b981",
        cyberYellow: "#f59e0b",
        cyberRed: "#ef4444"
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace', 'ui-monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      boxShadow: {
        'neon-cyan': '0 0 25px rgba(0, 245, 255, 0.35)',
        'neon-purple': '0 0 25px rgba(139, 92, 246, 0.35)',
        'neon-green': '0 0 20px rgba(16, 185, 129, 0.35)',
      }
    },
  },
  plugins: [],
}
