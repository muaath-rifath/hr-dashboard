# HR Dashboard

A modern HR management dashboard built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ⚡ Next.js 15 with App Router
- 🎨 Tailwind CSS with custom HR theme
- 🌙 Dark mode support
- 📱 Responsive design
- 🔧 TypeScript for type safety
- 🎯 Zustand for state management
- 🎨 Tabler Icons for beautiful icons
- 🧩 Modular component architecture

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Icons**: Tabler Icons
- **Utilities**: clsx + tailwind-merge

## Project Structure

```
hr-dashboard/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── store.ts          # Zustand stores
│   └── utils.ts          # Utility functions
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── tailwind.config.ts     # Tailwind configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Color Scheme

The dashboard uses a custom color scheme optimized for HR applications:

- **Primary**: Blue tones for trust and professionalism
- **Secondary**: Gray tones for neutral elements
- **Accent**: Orange tones for highlights and calls-to-action
- **Success**: Green for positive actions
- **Warning**: Yellow for caution states
- **Error**: Red for error states

## Dark Mode

The application supports dark mode using Tailwind's `class` strategy. The theme can be toggled programmatically using the Zustand theme store.

## State Management

The application uses Zustand for state management with three main stores:

- **Auth Store**: User authentication and session management
- **Dashboard Store**: Dashboard statistics and data
- **Theme Store**: UI theme preferences

## Type Safety

Comprehensive TypeScript types are defined for:

- User and employee data
- Department and leave management
- Dashboard statistics and charts
- API responses and pagination

## Development

This project is set up with:

- ESLint for code linting
- TypeScript for type checking
- Tailwind CSS for styling
- Path aliases for clean imports (`@/` points to root)

## License

MIT
