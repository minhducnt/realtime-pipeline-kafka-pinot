# Data Pipeline

Real-time data pipeline using Apache Kafka and Apache Pinot for transaction processing and analytics.

## Overview

This module handles the complete data pipeline from data ingestion through real-time processing to analytics storage.

## Components

### Apache Kafka
- **Producers**: Generate synthetic transaction data
- **Topics**: `transactions_raw`, `transactions_rt`
- **Consumers**: Process and clean transaction data

### Apache Pinot
- **Real-time Tables**: Live transaction ingestion
- **Offline Tables**: Historical data analysis
- **Schemas**: Transaction data models

## Directory Structure

```
data-pipeline/
├── conf/                  # Pinot configuration files
│   ├── transactions_schema.json
│   ├── transactions_realtime_table.json
│   └── transactions_offline_table.json
├── crawl_data/           # Kafka producers/consumers
│   ├── rt_producer.py    # Data generator
│   └── rt_processor.py   # Data processor
├── data/                 # Sample datasets
├── scripts/              # Utility scripts
│   ├── btl_pinot_connect.py
│   └── pinot_query_tool.py
└── segments/             # Pinot data segments
```

## Quick Start

### Start the Data Pipeline
```bash
cd data-pipeline
docker-compose up -d
```

### Generate Sample Data
```bash
python crawl_data/rt_producer.py
```

### Query Data
```bash
python scripts/pinot_query_tool.py --table transactions
```

## Configuration

### Kafka Topics
- `transactions_raw`: Raw transaction data
- `transactions_rt`: Processed transaction data

### Pinot Tables
- `transactions`: Real-time transaction table
- `transactions_offline`: Historical transaction table

## Development

### Adding New Data Sources
1. Create producer in `crawl_data/`
2. Update Kafka topic configurations
3. Add Pinot table schemas in `conf/`

### Monitoring
- Kafka: `localhost:9092`
- Pinot Controller: `localhost:9000`
- Pinot Broker: `localhost:8099`
