/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        genome: {
          bg: '#050f0a',
          panel: '#0a1a10',
          border: '#1a3a24',
          green: '#22c55e',
          'green-light': '#4ade80',
          'green-dim': '#16a34a',
          'green-glow': '#86efac',
          'green-muted': '#14532d',
          white: '#f0fdf4',
          gray: '#6b7280',
          'gray-light': '#9ca3af',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'dna-spin': 'dnaSpin 8s linear infinite',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'particle': 'particle 4s ease-in-out infinite',
      },
      keyframes: {
        dnaSpin: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        pulseGreen: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #22c55e, 0 0 10px #22c55e' },
          '100%': { boxShadow: '0 0 20px #22c55e, 0 0 40px #22c55e, 0 0 80px #22c55e' },
        },
        particle: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) translateX(20px)', opacity: '0' },
        }
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'green-sm': '0 0 10px rgba(34, 197, 94, 0.3)',
        'green-md': '0 0 20px rgba(34, 197, 94, 0.4)',
        'green-lg': '0 0 40px rgba(34, 197, 94, 0.5)',
        'green-xl': '0 0 80px rgba(34, 197, 94, 0.6)',
        'panel': '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(34,197,94,0.1)',
      }
    },
  },
  plugins: [],
}
