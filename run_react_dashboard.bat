@echo off
echo 🚀 Starting Real-Time React Dashboard...
echo 📊 Modern dashboard with Clean Architecture & TypeScript
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first:
    echo    - Download from: https://nodejs.org/
    echo    - Or use: choco install nodejs (Windows with Chocolatey)
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Navigate to React dashboard directory
cd dashboard

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo 🔗 Make sure your Pinot cluster is running on localhost:8099
echo 🌐 Dashboard will be available at: http://localhost:3000
echo ⚡ Real-time updates via Server-Sent Events
echo.
echo Press Ctrl+C to stop the dashboard
echo.

REM Start the development server
npm run dev
