# Real-Time Transaction Monitoring System

A complete real-time data pipeline and monitoring dashboard for transaction analytics and fraud detection.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data Pipeline │    │      API        │    │   Dashboard     │
│                 │    │                 │    │                 │
│ • Apache Kafka  │◄──►│ • Node.js       │◄──►│ • React/Next.js │
│ • Apache Pinot  │    │ • Express       │    │ • TypeScript    │
│ • Data Flow     │    │ • SSE Streams   │    │ • Clean Arch    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
realtime-transaction-monitoring/
├── data-pipeline/          # Kafka + Pinot data processing
│   ├── conf/              # Pinot configurations
│   ├── crawl_data/        # Producers/consumers
│   ├── data/              # Sample datasets
│   ├── scripts/           # Utility scripts
│   └── segments/          # Pinot data segments
├── dashboard/             # React dashboard (Clean Architecture)
│   ├── src/               # TypeScript/React code
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── api/                   # Backend API server
│   ├── src/               # Server code
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server
├── docker/                # Docker configurations
│   ├── docker-compose.yml # Full stack deployment
│   └── README.md          # Docker documentation
├── docs/                  # Documentation
└── README.md             # This file
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.8+ (for data pipeline scripts, optional)

### Option 1: One-Command Full System (Recommended)
```bash
# Windows Command Prompt
manage.bat start

# Linux/Mac
make start
```

### Option 2: Manual Setup

#### Windows Command Prompt:
```batch
# Install dependencies
manage.bat install

# Start full system
manage.bat start
```

#### Linux/Mac:
```bash
# Install dependencies
make install

# Start full system
make start
```

### Access the Dashboard
Open [http://localhost:3000](http://localhost:3000) in your browser

### Alternative: Development Mode

#### Windows:
```batch
# Show development setup instructions
manage.bat dev

# Then run in separate terminals:
# 1. cd docker; docker-compose -f docker-compose.pipeline.yml up -d
# 2. cd api; npm run dev
# 3. run_react_dashboard.bat
```

#### Linux/Mac:
```bash
# Show development setup instructions
make dev

# Then run in separate terminals:
# 1. cd docker && docker-compose -f docker-compose.pipeline.yml up -d
# 2. cd api && npm run dev
# 3. ./run_react_dashboard.sh
```

## 🎯 Features

### Real-Time Data Pipeline
- **Apache Kafka**: Message streaming
- **Apache Pinot**: Real-time analytics
- **Data Producers**: Synthetic transaction generation
- **Data Processors**: Fraud detection and enrichment

### Modern Dashboard
- **React/Next.js**: Modern frontend framework
- **TypeScript**: Type-safe development
- **Clean Architecture**: Maintainable code structure
- **Real-Time Updates**: Server-Sent Events
- **Responsive Design**: Works on all devices

### Fraud Detection
- **Real-Time Alerts**: Instant fraud notifications
- **Risk Scoring**: Transaction risk assessment
- **Geographic Analysis**: Fraud hotspots
- **Payment Method Analysis**: Risk by payment type

## 📊 Dashboard Features

### Real-Time Monitoring
- Live KPI metrics (transactions, fraud rates, amounts)
- Time series charts with real-time updates
- Geographic fraud distribution maps
- Payment method risk analysis

### Fraud Detection
- Real-time fraud alerts with severity levels
- Transaction feed with fraud indicators
- Historical fraud patterns
- Risk classification system

### Modern UI/UX
- Clean, modern interface with Shadcn/ui
- Responsive design for all screen sizes
- Dark/light theme support
- Smooth animations and transitions

## 🛠️ Technology Stack

### Backend
- **Node.js + Express**: API server
- **Apache Kafka**: Message streaming
- **Apache Pinot**: Real-time analytics
- **Docker**: Containerization

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn/ui + Radix**: UI components
- **Recharts**: Data visualization

### Data Processing
- **Python**: Data pipeline scripts
- **Kafka Python**: Message producers/consumers
- **Faker**: Synthetic data generation

## 🔧 Configuration

### Environment Variables

#### API Server (api/)
```env
PORT=3000
PINOT_HOST=localhost
PINOT_PORT=8099
UPDATE_INTERVAL=2000
```

#### Dashboard (dashboard/)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_UPDATE_INTERVAL=2000
```

#### Data Pipeline (docker/)
```env
PUBLIC_IP=your-public-ip
BOOTSTRAP_SERVERS=kafka:9092
TOPIC_RAW=transactions_raw
TOPIC_CLEAN=transactions_rt
```

## 📈 Data Flow

```
Synthetic Data → Kafka Producer → Kafka Topic → Kafka Consumer → Pinot
       ↓              ↓              ↓              ↓              ↓
   Data Generation  Raw Messages  Message Queue  Processing     Analytics
   (Python/Faker)   (transactions_raw)         (Cleaning)      (Real-time)
```

## 🧪 Development

### Running Individual Components

#### Data Pipeline Only
```bash
cd docker
docker-compose -f docker-compose.pipeline.yml up -d
```

#### API Server Only
```bash
cd api
npm install && npm run dev
```

#### Dashboard Only
```bash
cd dashboard
npm install && npm run dev
```

### Testing Data Flow
```bash
# Check Kafka topics
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Query Pinot
curl "http://localhost:8099/query/sql?sql=SELECT%20COUNT(*)%20FROM%20transactions"
```

## 🛠️ Project Management

This project includes convenient management scripts for easy operation:

### Windows Users
```batch
# Command Prompt
manage.bat <command>
```

### Linux/Mac Users
```bash
# Make commands
make <command>
```

### Available Commands
- `install` - Install all dependencies
- `start` - Start the full system
- `stop` - Stop all services
- `clean` - Clean up containers and volumes
- `dev` - Show development setup instructions
- `logs` - Show service logs
- `status` - Show service status
- `test` - Run tests
- `build` - Build for production
- `dashboard` - Start dashboard only

### Examples
```batch
# Windows
manage.bat start
manage.bat status
manage.bat clean

# Linux/Mac
make start
make status
make clean
```

## 📚 Documentation

- [Data Pipeline](./data-pipeline/README.md)
- [API Server](./api/README.md)
- [Dashboard](./dashboard/README.md)
- [Docker Setup](./docker/README.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## 🚀 Deployment

### Production Deployment
```bash
# Build and deploy
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

### Scaling
```bash
# Scale Pinot servers
docker-compose up -d --scale pinot-server=3

# Scale API servers
docker-compose up -d --scale api=2
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow Clean Architecture principles
4. Add tests for new features
5. Update documentation
6. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Apache Kafka** for real-time messaging
- **Apache Pinot** for real-time analytics
- **Next.js** for the React framework
- **Shadcn/ui** for beautiful components
- **Docker** for containerization

---

**Built with ❤️ using Clean Architecture and modern web technologies**