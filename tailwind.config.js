/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'fade-out': 'fadeOut 0.15s ease-in',
        'mirror-stop': 'mirrorStopFade 3s ease-out forwards',
        'spring-in': 'springIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-scale': 'springScale 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spring-scale-center': 'springScaleCenter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        mirrorStopFade: {
          '0%': { opacity: '0' },
          '12%': { opacity: '1' },
          '65%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        springIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        springScale: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        /* 左中央配置要素用：アニメーション中も translateX(-50%) を維持 */
        springScaleCenter: {
          '0%': { opacity: '0', transform: 'translateX(-50%) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateX(-50%) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
