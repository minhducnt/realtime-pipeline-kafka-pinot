# System Architecture

## Overview

The Real-Time Transaction Monitoring System is built with a modular, scalable architecture that separates concerns into distinct layers and components.

## Architectural Principles

### Clean Architecture
The system follows Clean Architecture principles:
- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External dependencies and frameworks
- **Presentation Layer**: UI and user interactions

### Microservices Design
- **Data Pipeline**: Independent data processing service
- **API Server**: Backend service for data access
- **Dashboard**: Frontend service for visualization

## System Components

### 1. Data Pipeline (`data-pipeline/`)

#### Apache Kafka
- **Purpose**: Real-time message streaming
- **Topics**:
  - `transactions_raw`: Raw transaction data
  - `transactions_rt`: Processed transaction data
- **Configuration**: `docker/docker-compose.yml`

#### Apache Pinot
- **Purpose**: Real-time OLAP database
- **Components**:
  - Controller: Cluster management
  - Broker: Query routing
  - Server: Data processing
- **Tables**:
  - `transactions`: Real-time table
  - `transactions_offline`: Historical table

#### Data Producers/Consumers
- **Producer** (`rt_producer.py`): Generates synthetic transactions
- **Consumer** (`rt_processor.py`): Processes and enriches data

### 2. API Server (`api/`)

#### Express.js Server
- **Purpose**: Backend API for dashboard data
- **Features**:
  - REST endpoints for queries
  - Server-Sent Events for real-time updates
  - Health monitoring

#### Real-Time Streaming
- **Protocol**: Server-Sent Events (SSE)
- **Update Frequency**: Every 2 seconds
- **Data Sources**: Pinot queries

### 3. Dashboard (`dashboard/`)

#### Clean Architecture Implementation
```
src/
├── domain/              # Business Rules
│   ├── entities/        # Transaction, User models
│   └── services/        # Business logic
├── application/         # Application Logic
│   ├── use-cases/       # Dashboard data retrieval
│   └── services/        # Data aggregation
├── infrastructure/      # External Interfaces
│   ├── api/            # Pinot API client
│   └── websocket/      # SSE connection
└── presentation/        # UI Layer
    ├── components/     # React components
    ├── pages/          # Page layouts
    └── lib/            # Utilities
```

#### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI**: Shadcn/ui + Radix UI primitives
- **Charts**: Recharts
- **Styling**: Tailwind CSS

## Data Flow

### Real-Time Data Pipeline

```
Synthetic Data Generation
        ↓
    Kafka Producer
        ↓
Raw Transaction Topic
        ↓
    Kafka Consumer
        ↓
Data Processing & Enrichment
        ↓
Processed Transaction Topic
        ↓
    Pinot Ingestion
        ↓
Real-Time Analytics
        ↓
    API Server Queries
        ↓
Server-Sent Events
        ↓
Dashboard Updates
```

### Query Flow

```
Dashboard Request
        ↓
    API Server
        ↓
   Pinot Query
        ↓
   Pinot Broker
        ↓
   Pinot Server
        ↓
Data Aggregation
        ↓
   API Response
        ↓
Dashboard Update
```

## Communication Patterns

### Synchronous Communication
- **REST API**: Dashboard → API Server
- **SQL Queries**: API Server → Pinot

### Asynchronous Communication
- **Server-Sent Events**: API Server → Dashboard
- **Kafka Messages**: Producers → Consumers

### Event-Driven Architecture
- **Real-Time Updates**: SSE streams live data
- **Fraud Alerts**: Immediate notifications
- **Data Processing**: Event-based workflows

## Deployment Architecture

### Docker Compose Setup
```
┌─────────────────────────────────────┐
│          Docker Network             │
├─────────────────────────────────────┤
│ Kafka + Zookeeper │ Pinot Cluster   │
├─────────────────────────────────────┤
│ Data Pipeline    │ API Server       │
├─────────────────────────────────────┤
│ Dashboard        │ Monitoring       │
└─────────────────────────────────────┘
```

### Service Dependencies
```
Dashboard → API Server → Pinot Broker → Pinot Server
    ↓           ↓           ↓
Real-Time   Real-Time   Data Storage
Updates     Queries     & Processing
```

## Scalability Considerations

### Horizontal Scaling
- **Kafka Brokers**: Multiple brokers for high throughput
- **Pinot Servers**: Distributed processing
- **API Servers**: Load balancing
- **Dashboard**: CDN distribution

### Vertical Scaling
- **Memory**: Pinot servers need significant RAM
- **CPU**: API servers for concurrent requests
- **Storage**: Kafka brokers for message retention

### Performance Optimization
- **Data Partitioning**: Kafka topic partitions
- **Indexing**: Pinot table indexes
- **Caching**: API response caching
- **Compression**: Message compression

## Security Architecture

### Network Security
- **Internal Networks**: Docker networks for services
- **Firewall Rules**: Port restrictions
- **SSL/TLS**: Encrypted communications

### Application Security
- **Input Validation**: API request validation
- **Authentication**: API key authentication (future)
- **Authorization**: Role-based access control
- **Data Encryption**: Sensitive data encryption

### Data Protection
- **PII Handling**: Personal data masking
- **Audit Logging**: Transaction logging
- **Compliance**: GDPR/CCPA compliance

## Monitoring & Observability

### Application Metrics
- **Performance**: Response times, throughput
- **Errors**: Exception tracking, error rates
- **Usage**: User activity, feature usage

### Infrastructure Metrics
- **System**: CPU, memory, disk usage
- **Network**: Bandwidth, latency
- **Services**: Health checks, availability

### Logging Strategy
- **Application Logs**: Structured logging
- **Audit Logs**: Security events
- **System Logs**: Docker container logs

## Development Workflow

### Local Development
1. **Start Data Pipeline**: `make dev`
2. **Run API Server**: `cd api && npm run dev`
3. **Start Dashboard**: `cd dashboard && npm run dev`
4. **Monitor Logs**: `make logs`

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and service testing
- **End-to-End Tests**: Full user workflows
- **Performance Tests**: Load and stress testing

### CI/CD Pipeline
1. **Linting**: Code quality checks
2. **Testing**: Automated test execution
3. **Building**: Docker image creation
4. **Deployment**: Automated deployment
5. **Monitoring**: Post-deployment monitoring

## Future Enhancements

### Advanced Features
- **Machine Learning**: Fraud prediction models
- **Real-Time Analytics**: Advanced metrics
- **Multi-Tenant**: Multi-organization support
- **API Gateway**: Centralized API management

### Technology Upgrades
- **Kubernetes**: Container orchestration
- **GraphQL**: Flexible API queries
- **Micro Frontends**: Modular dashboard
- **Event Sourcing**: Complete audit trails

### Scalability Improvements
- **Global Distribution**: Multi-region deployment
- **Auto Scaling**: Dynamic resource allocation
- **Data Partitioning**: Improved data distribution
- **Caching Layer**: Redis for performance
