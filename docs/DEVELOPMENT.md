# Development Guide

## Getting Started

### Prerequisites
- **Docker & Docker Compose**: For running the data pipeline
- **Node.js 18+**: For API server and dashboard
- **Python 3.8+**: For data pipeline scripts (optional)
- **Git**: Version control

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd realtime-transaction-monitoring

# Install all dependencies
make install

# Start the development environment
make dev
```

## Development Workflow

### 1. Choose Your Development Focus

#### Frontend Dashboard Development
```bash
# Start data pipeline and API
cd docker && docker-compose -f docker-compose.pipeline.yml up -d
cd api && npm run dev

# Start dashboard in development mode
cd dashboard && npm run dev
```

#### Backend API Development
```bash
# Start data pipeline
cd docker && docker-compose -f docker-compose.pipeline.yml up -d

# Start API server in development mode
cd api && npm run dev
```

#### Data Pipeline Development
```bash
# Start Kafka/Pinot only
cd docker && docker-compose -f docker-compose.pipeline.yml up -d

# Run data pipeline scripts
cd data-pipeline && python crawl_data/rt_producer.py
```

### 2. Code Structure

#### Dashboard (Clean Architecture)
```
dashboard/src/
├── domain/              # Business logic
│   ├── entities/        # TypeScript interfaces
│   └── services/        # Business rules
├── application/         # Application logic
│   ├── use-cases/       # Orchestration logic
│   └── services/        # Data processing
├── infrastructure/      # External dependencies
│   ├── api/            # HTTP clients
│   └── websocket/      # Real-time connections
└── presentation/        # UI layer
    ├── components/     # React components
    ├── pages/          # Page components
    ├── hooks/          # Custom hooks
    └── lib/            # Utilities
```

#### API Server
```
api/
├── server.js           # Main Express server
├── package.json        # Dependencies
└── node_modules/       # Installed packages
```

#### Data Pipeline
```
data-pipeline/
├── conf/              # Pinot configurations
├── crawl_data/        # Python scripts
├── data/              # Sample data
├── scripts/           # Utilities
└── segments/          # Pinot data
```

### 3. Adding New Features

#### Adding a Dashboard Component
1. **Domain Layer**: Define types and business logic
2. **Application Layer**: Create use case for data retrieval
3. **Infrastructure Layer**: Implement API calls if needed
4. **Presentation Layer**: Build React component

Example:
```typescript
// domain/entities/Metric.ts
export interface Metric {
  id: string;
  name: string;
  value: number;
  change: number;
}

// application/use-cases/GetMetrics.ts
export class GetMetrics {
  constructor(private metricService: MetricService) {}

  async execute(): Promise<Metric[]> {
    return this.metricService.getAll();
  }
}

// presentation/components/MetricCard.tsx
export function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Card>
      <h3>{metric.name}</h3>
      <p>{metric.value}</p>
    </Card>
  );
}
```

#### Adding an API Endpoint
1. Add route to `server.js`
2. Implement business logic
3. Add error handling
4. Update documentation

```javascript
// server.js
app.get('/api/new-endpoint', async (req, res) => {
  try {
    const data = await someBusinessLogic();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Adding Data Processing Logic
1. Update producer/consumer scripts
2. Modify data schemas if needed
3. Test with sample data
4. Update documentation

### 4. Testing

#### Unit Tests (Dashboard)
```bash
cd dashboard
npm test
npm test -- --watch  # Watch mode
npm test -- --coverage  # Coverage report
```

#### API Tests
```bash
cd api
npm test
```

#### Integration Tests
```bash
# Start services
make start

# Run integration tests
npm run test:integration
```

#### Manual Testing
```bash
# Health checks
curl http://localhost:3000/api/health
curl http://localhost:8099/query/sql?sql=SELECT%201

# Kafka topics
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092
```

### 5. Debugging

#### Dashboard Debugging
- Use React Developer Tools
- Check browser console for errors
- Use `console.log` in components
- Check network tab for API calls

#### API Debugging
```bash
# Check API logs
cd api && npm run dev

# Test endpoints manually
curl http://localhost:3000/api/health
```

#### Data Pipeline Debugging
```bash
# Check Kafka logs
docker-compose logs kafka

# Check Pinot logs
docker-compose logs pinot-controller

# Query Pinot directly
curl "http://localhost:8099/query/sql?sql=SELECT%20*%20FROM%20transactions%20LIMIT%2010"
```

### 6. Performance Optimization

#### Frontend Optimization
- Use React.memo for expensive components
- Implement lazy loading
- Optimize bundle size
- Use proper key props in lists

#### API Optimization
- Implement caching
- Use connection pooling
- Optimize database queries
- Add rate limiting

#### Data Pipeline Optimization
- Increase Kafka partitions
- Optimize Pinot queries
- Use appropriate data types
- Implement data compression

### 7. Code Quality

#### Linting
```bash
# Dashboard
cd dashboard && npm run lint

# API
cd api && npm run lint
```

#### Type Checking
```bash
# Dashboard
cd dashboard && npm run type-check
```

#### Formatting
```bash
# Dashboard
cd dashboard && npm run format
```

### 8. Database Operations

#### Pinot Operations
```bash
# Create table
curl -X POST http://localhost:9000/tables \
  -H "Content-Type: application/json" \
  -d @data-pipeline/conf/transactions_realtime_table.json

# Query data
curl "http://localhost:8099/query/sql?sql=SELECT%20COUNT(*)%20FROM%20transactions"

# Check table status
curl http://localhost:9000/tables/transactions
```

#### Kafka Operations
```bash
# List topics
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Create topic
docker exec kafka kafka-topics --create \
  --topic test-topic \
  --bootstrap-server localhost:9092

# Check topic data
docker exec kafka kafka-console-consumer \
  --topic transactions_raw \
  --bootstrap-server localhost:9092 \
  --from-beginning
```

### 9. Deployment

#### Local Production
```bash
# Build and run
make build
make start
```

#### Docker Deployment
```bash
cd docker
docker-compose -f docker-compose.prod.yml up -d
```

#### Environment Configuration
```bash
# Copy environment files
cp api/.env.example api/.env
cp dashboard/.env.example dashboard/.env

# Edit configurations
nano api/.env
nano dashboard/.env
```

### 10. Contributing Guidelines

#### Code Standards
- Follow TypeScript best practices
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Write comprehensive tests

#### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Write tests
# Update documentation

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

#### Documentation
- Update README files when adding features
- Add JSDoc comments to new functions
- Update API documentation for new endpoints
- Include examples in documentation

### 11. Troubleshooting

#### Common Issues

**Dashboard not loading**
```bash
# Check if API server is running
curl http://localhost:3000/api/health

# Check dashboard logs
cd dashboard && npm run dev
```

**Data not appearing**
```bash
# Check Kafka topics
docker exec kafka kafka-topics --list --bootstrap-server localhost:9092

# Check Pinot tables
curl http://localhost:9000/tables
```

**Connection errors**
```bash
# Restart services
make stop
make start

# Check network connectivity
docker network ls
```

**Performance issues**
```bash
# Check resource usage
docker stats

# Monitor logs
make logs
```

### 12. Advanced Development

#### Custom Data Sources
1. Create new producer script
2. Update Kafka topics
3. Modify Pinot schemas
4. Update dashboard components

#### Machine Learning Integration
1. Add ML model endpoints to API
2. Update data processing pipeline
3. Create ML-specific dashboard components

#### Multi-Tenant Support
1. Add tenant context to data models
2. Implement tenant isolation
3. Update authentication/authorization

This development guide provides a comprehensive overview of working with the Real-Time Transaction Monitoring System. Follow these guidelines to maintain code quality and contribute effectively to the project.
