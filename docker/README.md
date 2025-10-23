# Docker Configuration

Complete Docker setup for the real-time transaction monitoring system.

## Overview

This directory contains Docker configurations for running the entire stack:
- Apache Kafka + Zookeeper
- Apache Pinot (Controller, Broker, Server)
- Data Pipeline (Producers/Consumers)
- API Server
- Dashboard (Future)

## Docker Compose Files

### Full Stack (`docker-compose.yml`)
Complete system with all components:
- Kafka cluster
- Pinot cluster
- Data producers
- API server

```bash
docker-compose up -d
```

### Data Pipeline Only (`docker-compose.pipeline.yml`)
Kafka and Pinot only for data processing:

```bash
docker-compose -f docker-compose.pipeline.yml up -d
```

## Services

### Kafka Cluster
- **Zookeeper**: `localhost:2181`
- **Kafka Broker**: `localhost:9092`
- **Topics**: Auto-created

### Pinot Cluster
- **Controller**: `localhost:9000` (UI)
- **Broker**: `localhost:8099` (Queries)
- **Server**: Internal processing

### Data Pipeline
- **Producer**: Generates transaction data
- **Processor**: Cleans and enriches data
- **Topics**: `transactions_raw` → `transactions_rt`

## Configuration

### Environment Variables
```yaml
# Kafka
KAFKA_BROKER_ID: "1"
KAFKA_ZOOKEEPER_CONNECT: "zookeeper:2181"
PUBLIC_IP: "your-public-ip"

# Pinot
PINOT_CONTROLLER_PORT: 9000
PINOT_BROKER_PORT: 8099

# Data Pipeline
BOOTSTRAP_SERVERS: "kafka:9092"
TOPIC_RAW: "transactions_raw"
TOPIC_CLEAN: "transactions_rt"
```

## Usage

### Start Full System
```bash
cd docker
docker-compose up -d
```

### Start Data Pipeline Only
```bash
cd docker
docker-compose -f docker-compose.pipeline.yml up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f pinot-controller
```

### Stop Services
```bash
docker-compose down
docker-compose down -v  # Remove volumes
```

## Networking

### Internal Network
Services communicate via Docker networks:
- `kafka-net`: Kafka cluster
- `pinot-net`: Pinot cluster

### Port Mapping
- `2181`: Zookeeper
- `9092`: Kafka Broker
- `9000`: Pinot Controller UI
- `8099`: Pinot Broker Queries
- `3000`: API Server (Future)

## Volumes

### Persistent Data
- `kafka-data`: Kafka broker data
- `zookeeper-data`: Zookeeper data
- `pinot-data`: Pinot data segments

### Logs
All service logs are available via `docker-compose logs`

## Health Checks

### Service Health
```bash
# Check all services
docker-compose ps

# Check specific service
docker ps | grep pinot
```

### Application Health
```bash
# Pinot UI
curl http://localhost:9000

# API Server
curl http://localhost:3000/api/health
```

## Troubleshooting

### Common Issues

#### Kafka Connection Issues
```bash
# Restart Kafka
docker-compose restart kafka

# Check logs
docker-compose logs kafka
```

#### Pinot Not Starting
```bash
# Clear Pinot data
docker-compose down -v
docker-compose up -d pinot-controller

# Check Pinot logs
docker-compose logs pinot-controller
```

#### Data Pipeline Issues
```bash
# Restart producers
docker-compose restart tx-producer tx-processor

# Check producer logs
docker-compose logs tx-producer
```

### Performance Tuning

#### Memory Limits
```yaml
services:
  pinot-server:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

#### CPU Limits
```yaml
services:
  kafka:
    deploy:
      resources:
        limits:
          cpus: '1.0'
```

## Development

### Adding New Services
1. Add service definition to `docker-compose.yml`
2. Configure networking and volumes
3. Add health checks
4. Update documentation

### Custom Configuration
Override default settings:
```bash
docker-compose up -d --scale pinot-server=3
```

## Production Deployment

### Security
- Change default passwords
- Use secrets management
- Enable TLS/SSL
- Network isolation

### Monitoring
- Health checks
- Resource monitoring
- Log aggregation
- Alerting

### Backup
- Regular data backups
- Configuration backups
- Volume snapshots

## Support

For issues with Docker setup:
1. Check service logs
2. Verify port conflicts
3. Ensure sufficient resources
4. Update Docker and Compose versions
