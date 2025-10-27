# Real-Time Transaction Monitoring System
# Makefile for easy project management

.PHONY: help install start stop clean dev test build

# Default target
help:
	@echo "Real-Time Transaction Monitoring System"
	@echo ""
	@echo "Available commands:"
	@echo "  install       Install all dependencies"
	@echo "  start         Start the full system"
	@echo "  stop          Stop all services"
	@echo "  clean         Clean up containers and volumes"
	@echo "  dev           Start development environment"
	@echo "  logs          Show service logs"
	@echo "  status        Show service status"
	@echo "  test          Run tests"
	@echo "  build         Build for production"

# Install all dependencies
install:
	@echo "📦 Installing dependencies..."
	cd api && npm install
	cd dashboard && npm install
	cd data-pipeline && pip install -r requirements.txt || echo "Python dependencies optional"

# Start the full system
start:
	@echo "🚀 Starting full system..."
	cd docker && docker-compose up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10
	@echo "✅ System started!"
	@echo "🌐 Dashboard: http://localhost:3000"
	@echo "📊 Pinot UI: http://localhost:9000"

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	cd docker && docker-compose down

# Clean up containers and volumes
clean:
	@echo "🧹 Cleaning up containers and volumes..."
	cd docker && docker-compose down -v --remove-orphans
	docker system prune -f

# Development environment
dev:
	@echo "🔧 Starting development environment..."
	@echo "Terminal 1: Data Pipeline"
	@echo "Terminal 2: API Server"
	@echo "Terminal 3: Dashboard"
	@echo ""
	@echo "Run these commands in separate terminals:"
	@echo ""
	@echo "1. Data Pipeline:"
	@echo "   cd docker && docker-compose -f docker-compose.pipeline.yml up -d"
	@echo ""
	@echo "2. API Server:"
	@echo "   cd api && npm run dev"
	@echo ""
	@echo "3. Dashboard:"
	@echo "   cd dashboard && npm run dev"

# Show service logs
logs:
	cd docker && docker-compose logs -f --tail=100

# Show service status
status:
	@echo "📊 Service Status:"
	cd docker && docker-compose ps
	@echo ""
	@echo "🔍 Health Checks:"
	@echo "Pinot Controller: " && curl -s http://localhost:9000/health || echo "❌ Not responding"
	@echo "API Server: " && curl -s http://localhost:3000/api/health | head -n 5 || echo "❌ Not responding"

# Run tests
test:
	@echo "🧪 Running tests..."
	cd dashboard && npm test
	cd api && npm test

# Build for production
build:
	@echo "🔨 Building for production..."
	cd dashboard && npm run build
	cd api && npm run build

# Quick dashboard start
dashboard:
	@echo "🎯 Starting dashboard..."
	@echo "📊 Modern dashboard with Clean Architecture & TypeScript"
	@echo ""
	@if command -v node >/dev/null 2>&1; then \
		echo "✅ Node.js found"; \
	else \
		echo "❌ Node.js is not installed. Please install Node.js first:"; \
		echo "   - Download from: https://nodejs.org/"; \
		echo "   - Or use: choco install nodejs (Windows with Chocolatey)"; \
		echo "   - Or use: apt install nodejs npm (Linux)"; \
		echo "   - Or use: brew install node (macOS)"; \
		exit 1; \
	fi
	@if command -v npm >/dev/null 2>&1; then \
		echo "✅ npm found"; \
	else \
		echo "❌ npm is not installed. Please install npm first."; \
		exit 1; \
	fi
	@echo ""
	@echo "📦 Checking dependencies..."
	cd dashboard/transaction-dashboard && \
	if [ ! -d "node_modules" ]; then \
		echo "📦 Installing dependencies..."; \
		npm install; \
		if [ $$? -ne 0 ]; then \
			echo "❌ Failed to install dependencies"; \
			exit 1; \
		fi; \
	fi
	@echo ""
	@echo "🔗 Make sure your Pinot cluster is running on localhost:8099"
	@echo "🌐 Dashboard will be available at: http://localhost:3000"
	@echo "⚡ Real-time updates via Server-Sent Events"
	@echo ""
	@echo "Press Ctrl+C to stop the dashboard"
	@echo ""
	cd dashboard/transaction-dashboard && npm run dev

# Database operations
db-init:
	@echo "🗄️ Initializing database..."
	cd docker && docker-compose exec pinot-controller /opt/pinot/bin/pinot-admin.sh AddTable \
		-tableConfigFile /opt/pinot/config/transactions_realtime_table.json \
		-schemaFile /opt/pinot/config/transactions_schema.json

db-query:
	@echo "🔍 Querying database..."
	curl "http://localhost:8099/query/sql?sql=SELECT%20COUNT(*)%20FROM%20transactions"

# Monitoring
monitor:
	@echo "📈 Monitoring services..."
	@echo "Press Ctrl+C to stop"
	docker stats

# Backup
backup:
	@echo "💾 Creating backup..."
	mkdir -p backups
	cd docker && docker run --rm -v realtime-transaction-monitoring_pinot-data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/pinot-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C / data
	@echo "✅ Backup created in backups/ directory"
