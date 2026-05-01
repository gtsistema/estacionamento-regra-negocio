/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        card: '#1E293B',
        cardHover: '#263349',
        border: '#334155',
        accent: '#38BDF8',
        accentDark: '#0EA5E9',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
        muted: '#94A3B8',
        text: '#F1F5F9',
        textSub: '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'slide-in-left': 'slideInLeft 0.25s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideInRight: { from: { transform: 'translateX(20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        slideInLeft: { from: { transform: 'translateX(-20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        scaleIn: { from: { transform: 'scale(0.95)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
        pulseGlow: { '0%, 100%': { boxShadow: '0 0 8px rgba(56,189,248,0.4)' }, '50%': { boxShadow: '0 0 20px rgba(56,189,248,0.8)' } },
      },
    },
  },
  plugins: [],
};
