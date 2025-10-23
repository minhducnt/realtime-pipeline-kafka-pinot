# Transaction Monitoring Dashboard

Modern React/Next.js dashboard for real-time transaction monitoring with Clean Architecture.

## Overview

A comprehensive dashboard built with modern web technologies for monitoring transaction data, fraud detection, and real-time analytics.

## Architecture

This dashboard follows **Clean Architecture** principles:

```
src/
├── domain/              # Business Logic Layer
│   ├── entities/        # Domain Models
│   └── services/        # Domain Services
├── application/         # Application Layer
│   ├── use-cases/       # Application Logic
│   └── services/        # Application Services
├── infrastructure/      # Infrastructure Layer
│   ├── api/            # External API Clients
│   └── websocket/      # Real-time Connections
└── presentation/        # Presentation Layer
    ├── components/     # React Components
    ├── pages/          # Page Components
    ├── hooks/          # Custom Hooks
    └── lib/            # Utilities
```

## Features

### Real-Time Monitoring
- **Live KPI Cards**: Transaction counts, fraud rates, amounts
- **Time Series Charts**: Transaction volume over time
- **Geographic Maps**: Fraud hotspots by country
- **Payment Analytics**: Method-wise transaction analysis

### Fraud Detection
- **Real-Time Alerts**: Instant fraud notifications
- **Risk Classification**: Low/Medium/High severity alerts
- **Transaction Feed**: Live transaction monitoring

### Modern UI/UX
- **Responsive Design**: Works on all devices
- **Dark/Light Themes**: System preference support
- **Smooth Animations**: Loading states and transitions
- **Accessible**: WCAG compliant components

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Shadcn/ui + Radix UI
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Real-time**: Server-Sent Events
- **State**: React Hooks + Context

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Running API server (port 3000)

### Installation
```bash
cd dashboard
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_UPDATE_INTERVAL=2000
```

## Components

### Core Components
- `KpiCard`: KPI metrics with change indicators
- `TimeSeriesChart`: Transaction volume visualization
- `GeographicChart`: Country-wise distribution
- `PaymentMethodChart`: Payment method analysis
- `FraudAlerts`: Real-time fraud notifications
- `TransactionsTable`: Transaction data table

### UI Components
- `Card`: Content containers
- `Badge`: Status indicators
- `Button`: Interactive elements
- `Charts`: Data visualization

## Real-Time Features

### Server-Sent Events
- Persistent connection to API server
- Instant updates when data changes
- Automatic reconnection on failures
- Connection status monitoring

### Live Updates
- KPI metrics update every 2 seconds
- Charts refresh with new data
- Fraud alerts appear immediately
- Transaction feed streams live

## Development

### Adding New Features
1. **Domain Layer**: Define business logic
2. **Application Layer**: Create use cases
3. **Infrastructure Layer**: Implement external services
4. **Presentation Layer**: Build React components

### Component Structure
```
ComponentName/
├── index.tsx          # Main component
├── types.ts          # TypeScript definitions
├── hooks.ts          # Custom hooks
├── utils.ts          # Helper functions
└── styles.ts         # Component styles
```

### State Management
- Use React hooks for local state
- Context API for global state
- Custom hooks for reusable logic

## Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm ci --only=production
EXPOSE 3000
CMD ["npm", "start"]
```

## Performance

### Optimizations
- Code splitting with Next.js
- Image optimization
- Bundle analysis
- Lazy loading components

### Monitoring
- Real-time connection status
- Error boundaries
- Performance metrics
- User analytics

## Contributing

1. Follow Clean Architecture principles
2. Use TypeScript for type safety
3. Write comprehensive tests
4. Follow component structure guidelines
5. Update documentation

## License

MIT License
