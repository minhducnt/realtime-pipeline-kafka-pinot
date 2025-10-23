#!/bin/bash

echo "🚀 Starting Real-Time React Dashboard..."
echo "📊 Modern dashboard with Clean Architecture & TypeScript"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   - Download from: https://nodejs.org/"
    echo "   - Or use: apt install nodejs npm (Linux)"
    echo "   - Or use: brew install node (macOS)"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Navigate to React dashboard directory
cd dashboard

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "🔗 Make sure your Pinot cluster is running on localhost:8099"
echo "🌐 Dashboard will be available at: http://localhost:3000"
echo "⚡ Real-time updates via Server-Sent Events"
echo ""
echo "Press Ctrl+C to stop the dashboard"
echo ""

# Start the development server
npm run dev
