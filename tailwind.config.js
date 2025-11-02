/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // InnerAnimalMedia Brand Colors - Neumorphic Design
        brand: {
          teal: '#5F9C9E',
          'teal-light': '#7DB8BA',
          'teal-dark': '#4A7D7F',
        },
        charcoal: {
          deep: '#1A1D23',
          base: '#22252B',
          light: '#2C3038',
          lighter: '#363A42',
        },
        accent: {
          beige: '#E8DDD0',
          cream: '#F5F1EC',
        },
        // Override defaults for neumorphic style
        background: '#1A1D23',
        foreground: '#FAFAF8',
        border: '#363A42',
        input: '#22252B',
        ring: '#5F9C9E',
        primary: {
          DEFAULT: '#5F9C9E',
          foreground: '#1A1D23',
        },
        secondary: {
          DEFAULT: '#2C3038',
          foreground: '#FAFAF8',
        },
        muted: {
          DEFAULT: '#22252B',
          foreground: '#B8BCC4',
        },
        accent: {
          DEFAULT: '#5F9C9E',
          foreground: '#1A1D23',
        },
        card: {
          DEFAULT: '#22252B',
          foreground: '#FAFAF8',
        },
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        // Neumorphic Shadows
        'neu-emboss': '8px 8px 16px rgba(0, 0, 0, 0.5), -4px -4px 12px rgba(255, 255, 255, 0.08)',
        'neu-emboss-sm': '4px 4px 8px rgba(0, 0, 0, 0.5), -2px -2px 6px rgba(255, 255, 255, 0.08)',
        'neu-emboss-lg': '12px 12px 24px rgba(0, 0, 0, 0.5), -6px -6px 16px rgba(255, 255, 255, 0.08)',
        'neu-deboss': 'inset 6px 6px 12px rgba(0, 0, 0, 0.7), inset -3px -3px 8px rgba(255, 255, 255, 0.03)',
        'neu-deboss-sm': 'inset 4px 4px 8px rgba(0, 0, 0, 0.7), inset -2px -2px 6px rgba(255, 255, 255, 0.03)',
        'glow-teal': '0 0 20px rgba(95, 156, 158, 0.4), 0 0 40px rgba(95, 156, 158, 0.2)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(95, 156, 158, 0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(95, 156, 158, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

