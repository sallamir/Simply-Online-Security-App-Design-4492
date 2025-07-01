/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Simply Online Brand Colors - Orange & Black Theme
        primary: {
          50: '#fff7ed',   // Very light orange
          100: '#ffedd5',  // Light orange
          200: '#fed7aa',  // Soft orange
          300: '#fdba74',  // Medium orange
          400: '#fb923c',  // Bright orange
          500: '#f97316',  // Main orange (Simply Online primary)
          600: '#ea580c',  // Dark orange
          700: '#c2410c',  // Darker orange
          800: '#9a3412',  // Deep orange
          900: '#7c2d12',  // Very dark orange
        },
        secondary: {
          50: '#f9fafb',   // Very light grey
          100: '#f3f4f6',  // Light grey
          200: '#e5e7eb',  // Soft grey
          300: '#d1d5db',  // Medium light grey
          400: '#9ca3af',  // Medium grey
          500: '#6b7280',  // Main grey
          600: '#4b5563',  // Dark grey
          700: '#374151',  // Darker grey
          800: '#1f2937',  // Very dark grey
          900: '#111827',  // Almost black (Simply Online secondary)
        },
        accent: {
          50: '#fef3c7',   // Light yellow accent
          100: '#fde68a',  // Yellow accent
          500: '#f59e0b',  // Gold accent
          600: '#d97706',  // Dark gold accent
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}