import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        deadline: {
          overdue: "hsl(var(--deadline-overdue))",
          'due-soon': "hsl(var(--deadline-due-soon))",
          'coming-up': "hsl(var(--deadline-coming-up))",
          safe: "hsl(var(--deadline-safe))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        neo: '2px 2px 0px hsl(var(--border))',
        'neo-sm': '1px 1px 0px hsl(var(--border))',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'float-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px) scale(0.95)',
          },
          '15%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
          '85%': {
            opacity: '1',
            transform: 'translateY(-15px) scale(1)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-30px) scale(0.95)',
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.3',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.6',
            transform: 'scale(1.1)',
          },
        },
        'dash': {
          '0%': {
            strokeDasharray: '0, 1000',
            strokeDashoffset: '0',
          },
          '50%': {
            strokeDasharray: '100, 1000',
            strokeDashoffset: '-50',
          },
          '100%': {
            strokeDasharray: '0, 1000',
            strokeDashoffset: '-200',
          },
        },
        'dash-reverse': {
          '0%': {
            strokeDasharray: '0, 1000',
            strokeDashoffset: '0',
          },
          '50%': {
            strokeDasharray: '80, 1000',
            strokeDashoffset: '50',
          },
          '100%': {
            strokeDasharray: '0, 1000',
            strokeDashoffset: '200',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float-up': 'float-up 15s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
        'dash': 'dash 8s ease-in-out infinite',
        'dash-reverse': 'dash-reverse 10s ease-in-out infinite',
      },
      transitionProperty: {
        'shadow-transform': 'box-shadow, transform',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
