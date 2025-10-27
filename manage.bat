@echo off
REM Real-Time Transaction Monitoring System
REM Batch script for Windows project management

if "%1"=="" goto help
goto %1

:help
echo Real-Time Transaction Monitoring System
echo ==================================================
echo.
echo Available commands:
echo   manage.bat install       Install all dependencies
echo   manage.bat start         Start the full system
echo   manage.bat stop          Stop all services
echo   manage.bat clean         Clean up containers and volumes
echo   manage.bat dev           Show development setup instructions
echo   manage.bat logs          Show service logs
echo   manage.bat status        Show service status
echo   manage.bat test          Run tests
echo   manage.bat build         Build for production
echo   manage.bat dashboard     Start dashboard only
echo.
echo Examples:
echo   manage.bat start
echo   manage.bat dev
echo   manage.bat dashboard
echo.
goto end

:install
echo 📦 Installing dependencies...
echo.

REM Install API dependencies
if exist "api" (
    echo Installing API dependencies...
    cd api
    npm install
    cd ..
    echo.
)

REM Install Dashboard dependencies
if exist "dashboard\transaction-dashboard" (
    echo Installing Dashboard dependencies...
    cd dashboard\transaction-dashboard
    npm install
    cd ..\..
    echo.
)

echo ✅ Dependencies installed!
goto end

:start
echo 🚀 Starting full system...
cd docker
docker-compose up -d
cd ..
echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul
echo ✅ System started!
echo 🌐 Dashboard: http://localhost:3000
echo 📊 Pinot UI: http://localhost:9000
goto end

:stop
echo 🛑 Stopping all services...
cd docker
docker-compose down
cd ..
echo ✅ Services stopped!
goto end

:clean
echo 🧹 Cleaning up containers and volumes...
cd docker
docker-compose down -v --remove-orphans
cd ..
docker system prune -f
echo ✅ Cleanup completed!
goto end

:dev
echo 🔧 Development Environment Setup
echo ================================
echo.
echo Open these commands in SEPARATE terminals:
echo.
echo 1. Data Pipeline:
echo    cd docker ^& docker-compose -f docker-compose.pipeline.yml up -d
echo.
echo 2. API Server:
echo    cd api ^& npm run dev
echo.
echo 3. Dashboard:
echo    cd dashboard\transaction-dashboard ^& npm run dev
echo.
echo Or use the convenience script:
echo    run_react_dashboard.bat
echo.
goto end

:logs
echo 📋 Showing service logs (Ctrl+C to stop)...
cd docker
docker-compose logs -f --tail=100
cd ..
goto end

:status
echo 📊 Service Status:
echo ==================
cd docker
docker-compose ps
cd ..
echo.
echo 🔍 Health Checks:
echo ================

REM Check Pinot
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:9000/health' -TimeoutSec 5; Write-Host 'Pinot Controller: 🟢 Connected' -ForegroundColor Green } catch { Write-Host 'Pinot Controller: 🔴 Not responding' -ForegroundColor Red }"

REM Check API
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/health' -TimeoutSec 5; $data = $response.Content | ConvertFrom-Json; Write-Host 'API Server: 🟢 Connected' -ForegroundColor Green; Write-Host ('  Clients connected: ' + $data.clients) -ForegroundColor Cyan } catch { Write-Host 'API Server: 🔴 Not responding' -ForegroundColor Red }"

goto end

:test
echo 🧪 Running tests...

REM Test Dashboard
if exist "dashboard\transaction-dashboard" (
    echo Testing Dashboard...
    cd dashboard\transaction-dashboard
    npm test
    cd ..\..
    echo.
)

REM Test API
if exist "api" (
    echo Testing API...
    cd api
    npm test
    cd ..
    echo.
)

echo ✅ Tests completed!
goto end

:build
echo 🔨 Building for production...

REM Build Dashboard
if exist "dashboard\transaction-dashboard" (
    echo Building Dashboard...
    cd dashboard\transaction-dashboard
    npm run build
    cd ..\..
    echo.
)

REM Build API
if exist "api" (
    echo Building API...
    cd api
    npm run build
    cd ..
    echo.
)

echo ✅ Build completed!
goto end

:dashboard
echo 🎯 Starting dashboard only...
make dashboard
goto end

:end
