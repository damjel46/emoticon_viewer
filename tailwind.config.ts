import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kakao: {
          yellow: '#fee500',
          blue: '#b2c7d9',
          dark: '#1a1a2e',
          pink: '#f9cdd4',
          lemon: '#fff9c4',
          bubble: '#ffffff',
          timestamp: '#6b7280',
          nav: '#3c1e1e',
          navActive: '#fee500',
        },
      },
      fontFamily: {
        kakao: ['"Apple SD Gothic Neo"', '"Noto Sans KR"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
