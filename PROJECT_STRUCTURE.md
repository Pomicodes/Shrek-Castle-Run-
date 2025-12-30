# Project Structure

This document describes the improved project structure for Shrek's Castle Run.

## Directory Structure

```
Shrek-Castle-Run/
├── components/          # React components
│   ├── GameCanvas.tsx   # Main game canvas component
│   ├── Menu.tsx         # Menu and UI components
│   └── index.ts         # Component exports (barrel export)
│
├── services/            # Business logic services
│   ├── levelService.ts  # Level generation logic
│   └── index.ts         # Service exports (barrel export)
│
├── utils/               # Utility functions
│   └── castleRenderer.ts # Castle drawing utilities
│
├── types.ts             # TypeScript type definitions
├── constants.ts         # Game constants and configuration
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

