# Real-Time Transaction Dashboard

A modern, real-time transaction monitoring dashboard built with **Next.js 14**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Radix UI**. Implements **Clean Architecture** principles for maintainable, scalable code.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/              # Business Logic Layer
│   ├── entities/        # Domain Entities & Types
│   └── services/        # Domain Services
├── application/         # Application Layer
│   ├── use-cases/       # Application Use Cases
│   └── services/        # Application Services
├── infrastructure/      # Infrastructure Layer
│   ├── api/            # External API Services
│   └── websocket/      # Real-time Communication
└── presentation/        # Presentation Layer
    ├── components/     # React Components
    ├── pages/          # Page Components
    ├── hooks/          # Custom React Hooks
    └── lib/            # Utilities & Helpers
```

## 🚀 Features

### Real-Time Monitoring
- **Live KPI Metrics** - Transaction counts, fraud rates, amounts
- **Time Series Charts** - Transaction volume over time
- **Geographic Distribution** - Fraud hotspots by country
- **Payment Method Analysis** - Risk assessment by payment type

### Fraud Detection
- **Real-Time Alerts** - Instant fraud notifications
- **Severity Classification** - Low/Medium/High risk alerts
- **Transaction Feed** - Live transaction monitoring

### Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, mobile
- **Dark/Light Mode** - System preference detection
- **Smooth Animations** - Loading states and transitions
- **Accessible Components** - Built with Radix UI primitives

### Technical Features
- **Server-Sent Events** - True real-time data streaming
- **TypeScript** - Full type safety
- **Clean Architecture** - Maintainable, testable code
- **Error Handling** - Graceful failure recovery

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Shadcn/ui
- **Charts:** Recharts
- **Real-time:** Server-Sent Events
- **Backend:** Node.js + Express (for SSE)
- **Database:** Apache Pinot (via REST API)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Running Apache Pinot instance
- Running Node.js server (for SSE)

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_UPDATE_INTERVAL=2000
```

Or copy from the example file:
```bash
cp env.example .env.local
```

### Backend Server
The dashboard connects to a Node.js server that provides Server-Sent Events:

```bash
# Start the backend server (from visualization/ directory)
npm start
```

## 📊 Components

### Core Components
- `KpiCard` - KPI metrics with change indicators
- `TimeSeriesChart` - Transaction volume over time
- `GeographicChart` - Country-wise distribution
- `PaymentMethodChart` - Payment method analysis
- `FraudAlerts` - Real-time fraud notifications
- `TransactionsTable` - Recent transactions feed

### UI Components
- `Card` - Content containers
- `Badge` - Status indicators
- `Button` - Interactive elements
- `Charts` - Data visualization components

## 🔄 Real-Time Updates

The dashboard uses **Server-Sent Events (SSE)** for real-time updates:

1. **Client** establishes SSE connection to server
2. **Server** queries Pinot every 2 seconds
3. **Server** broadcasts updates to all connected clients
4. **Client** receives updates instantly without polling

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build Docker image
docker build -t transaction-dashboard .

# Run container
docker run -p 3000:3000 transaction-dashboard
```

## 📝 Development

### Adding New Features
1. **Domain Layer** - Define entities and business rules
2. **Application Layer** - Create use cases
3. **Infrastructure Layer** - Implement external services
4. **Presentation Layer** - Build React components

### Component Structure
```
Component/
├── index.tsx          # Main component
├── types.ts          # TypeScript types
├── hooks.ts          # Custom hooks
├── utils.ts          # Helper functions
└── styles.ts         # Component styles
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow Clean Architecture principles
4. Add tests for new features
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Apache Pinot** for real-time analytics
- **Next.js** for the React framework
- **Radix UI** for accessible components
- **Recharts** for data visualization
- **Tailwind CSS** for styling

---

Built with ❤️ using Clean Architecture principles