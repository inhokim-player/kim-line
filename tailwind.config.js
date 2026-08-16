/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14171F',
        subink: '#6B7280',
        surface: '#FFFFFF',
        canvas: '#F5F7F8',
        line: '#E5E8EB',
        pulse: {
          50: '#EAF7F3',
          100: '#CFEEE3',
          400: '#2FB894',
          500: '#0F9D82',
          600: '#0C7E69'
        },
        alert: {
          100: '#FBE4DF',
          400: '#EC7A66',
          500: '#E85D4E',
          600: '#C7412F'
        },
        coral: {
          400: '#EC7A66',
          500: '#E85D4E',
          600: '#C7412F'
        },
        navy: {
          950: '#0B1220',
          900: '#131B2E',
          border: '#25304C'
        },
        shield: {
          200: '#DCE8FF',
          400: '#8FC0FF',
          500: '#2F6FED',
          600: '#1E4FBF',
          glow: '#5B9CFF'
        }
      },
      fontFamily: {
        display: ['Pretendard', 'system-ui', 'sans-serif'],
        body: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        card: '20px',
        pill: '999px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,23,31,0.04), 0 8px 24px rgba(20,23,31,0.06)'
      }
    }
  },
  plugins: []
}
