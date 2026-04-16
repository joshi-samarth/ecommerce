/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                    900: '#312E81',
                },
                brand: '#6366F1',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '10px',
            },
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,0.08)',
                md: '0 4px 12px rgba(0,0,0,0.10)',
                lg: '0 8px 30px rgba(0,0,0,0.12)',
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite',
            },
        },
    },
    plugins: [],
};
