# Real-Time API Server

Node.js Express server providing real-time data streaming for the transaction monitoring dashboard.

## Overview

This API server acts as the backend for the real-time dashboard, providing Server-Sent Events (SSE) for live data updates and REST endpoints for data queries.

## Features

- **Server-Sent Events**: Real-time data streaming
- **REST API**: Query endpoints for Pinot data
- **Health Checks**: System monitoring endpoints
- **CORS Support**: Cross-origin requests enabled

## API Endpoints

### Real-Time Streaming
```
GET /api/realtime
```
Returns Server-Sent Events stream with live dashboard data.

**Response Format:**
```json
{
  "timestamp": "2025-10-23T11:17:00.000Z",
  "metrics": {
    "summary": [...],
    "timeSeries": [...],
    "geographic": [...],
    "paymentMethods": [...],
    "recentActivity": [...],
    "alerts": [...]
  }
}
```

### Data Queries
```
POST /#/query
```

Execute custom SQL queries against Pinot.

**Request Body:**
```json
{
  "sql": "SELECT * FROM transactions LIMIT 10"
}
```

### Health Check
```
GET /api/health
```

System health monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-23T11:17:00.000Z",
  "pinot": "connected",
  "clients": 2
}
```

## Configuration

### Environment Variables
```env
PORT=3000                    # Server port
PINOT_HOST=localhost        # Pinot broker host
PINOT_PORT=8099             # Pinot broker port
UPDATE_INTERVAL=2000        # Update interval (ms)
```

## Quick Start

### Development
```bash
cd api
npm install
npm run dev
```

### Production
```bash
cd api
npm install
npm start
```

## Architecture

### Data Flow
```
Dashboard → API Server → Pinot Broker → Real-time Data
     ↑           ↑             ↑
   SSE      REST API     SQL Queries
 Updates   Endpoints    Analytics
```

### Real-Time Updates
- Polls Pinot every 2 seconds
- Broadcasts updates to all connected SSE clients
- Automatic reconnection on connection loss

## Dependencies

- **express**: Web framework
- **axios**: HTTP client for Pinot queries
- **cors**: Cross-origin resource sharing

## Development

### Adding New Endpoints
1. Add route in `server.js`
2. Implement business logic
3. Add error handling
4. Update documentation

### Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Test SSE (requires browser or SSE client)
# Open http://localhost:3000/api/realtime in browser
```

## Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Production Considerations
- Use environment variables for configuration
- Implement proper logging
- Add rate limiting
- Enable HTTPS
- Set up monitoring
