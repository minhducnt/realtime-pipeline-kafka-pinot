# Real-Time Transaction Monitoring System
# PowerShell script for Windows project management

param(
    [string]$Command = "help"
)

function Write-Header {
    Write-Host "Real-Time Transaction Monitoring System" -ForegroundColor Cyan
    Write-Host ("=" * 50) -ForegroundColor Cyan
}

function Show-Help {
    Write-Header
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  .\manage.ps1 install       Install all dependencies"
    Write-Host "  .\manage.ps1 start         Start the full system"
    Write-Host "  .\manage.ps1 stop          Stop all services"
    Write-Host "  .\manage.ps1 clean         Clean up containers and volumes"
    Write-Host "  .\manage.ps1 dev           Start development environment"
    Write-Host "  .\manage.ps1 logs          Show service logs"
    Write-Host "  .\manage.ps1 status        Show service status"
    Write-Host "  .\manage.ps1 test          Run tests"
    Write-Host "  .\manage.ps1 build         Build for production"
    Write-Host "  .\manage.ps1 dashboard     Start dashboard only"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\manage.ps1 start"
    Write-Host "  .\manage.ps1 dev"
    Write-Host "  .\manage.ps1 dashboard"
}

function Install-Dependencies {
    Write-Header
    Write-Host "📦 Installing dependencies..." -ForegroundColor Green
    Write-Host ""

    # Install API dependencies
    if (Test-Path "api") {
        Write-Host "Installing API dependencies..." -ForegroundColor Yellow
        Push-Location api
        npm install
        Pop-Location
        Write-Host ""
    }

    # Install Dashboard dependencies
    if (Test-Path "dashboard/transaction-dashboard") {
        Write-Host "Installing Dashboard dependencies..." -ForegroundColor Yellow
        Push-Location dashboard/transaction-dashboard
        npm install
        Pop-Location
        Write-Host ""
    }

    Write-Host "✅ Dependencies installed!" -ForegroundColor Green
}

function Start-System {
    Write-Header
    Write-Host "🚀 Starting full system..." -ForegroundColor Green

    Push-Location docker
    docker-compose up -d
    Pop-Location

    Write-Host ""
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10

    Write-Host "✅ System started!" -ForegroundColor Green
    Write-Host "🌐 Dashboard: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "📊 Pinot UI: http://localhost:9000" -ForegroundColor Cyan
}

function Stop-System {
    Write-Header
    Write-Host "🛑 Stopping all services..." -ForegroundColor Red

    Push-Location docker
    docker-compose down
    Pop-Location

    Write-Host "✅ Services stopped!" -ForegroundColor Green
}

function Clean-System {
    Write-Header
    Write-Host "🧹 Cleaning up containers and volumes..." -ForegroundColor Yellow

    Push-Location docker
    docker-compose down -v --remove-orphans
    Pop-Location

    docker system prune -f

    Write-Host "✅ Cleanup completed!" -ForegroundColor Green
}

function Start-Dev {
    Write-Header
    Write-Host "🔧 Starting development environment..." -ForegroundColor Green
    Write-Host ""
    Write-Host "Open these commands in SEPARATE terminals:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Data Pipeline:" -ForegroundColor Magenta
    Write-Host "   cd docker; docker-compose -f docker-compose.pipeline.yml up -d"
    Write-Host ""
    Write-Host "2. API Server:" -ForegroundColor Magenta
    Write-Host "   cd api; npm run dev"
    Write-Host ""
    Write-Host "3. Dashboard:" -ForegroundColor Magenta
    Write-Host "   cd dashboard/transaction-dashboard; npm run dev"
    Write-Host ""
    Write-Host "Or use the convenience script:" -ForegroundColor Green
    Write-Host "   .\run_react_dashboard.bat"
}

function Show-Logs {
    Write-Header
    Write-Host "📋 Showing service logs..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Red
    Write-Host ""

    Push-Location docker
    docker-compose logs -f --tail=100
    Pop-Location
}

function Show-Status {
    Write-Header
    Write-Host "📊 Service Status:" -ForegroundColor Yellow

    Push-Location docker
    docker-compose ps
    Pop-Location

    Write-Host ""
    Write-Host "🔍 Health Checks:" -ForegroundColor Yellow

    try {
        $pinotResponse = Invoke-WebRequest -Uri "http://localhost:9000/health" -TimeoutSec 5
        Write-Host "Pinot Controller: 🟢 Connected" -ForegroundColor Green
    } catch {
        Write-Host "Pinot Controller: 🔴 Not responding" -ForegroundColor Red
    }

    try {
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5
        $apiStatus = ($apiResponse.Content | ConvertFrom-Json)
        Write-Host "API Server: 🟢 Connected" -ForegroundColor Green
        Write-Host "  Clients connected: $($apiStatus.clients)" -ForegroundColor Cyan
    } catch {
        Write-Host "API Server: 🔴 Not responding" -ForegroundColor Red
    }
}

function Run-Tests {
    Write-Header
    Write-Host "🧪 Running tests..." -ForegroundColor Yellow

    # Test Dashboard
    if (Test-Path "dashboard/transaction-dashboard") {
        Write-Host "Testing Dashboard..." -ForegroundColor Cyan
        Push-Location dashboard/transaction-dashboard
        npm test
        Pop-Location
        Write-Host ""
    }

    # Test API
    if (Test-Path "api") {
        Write-Host "Testing API..." -ForegroundColor Cyan
        Push-Location api
        npm test
        Pop-Location
        Write-Host ""
    }

    Write-Host "✅ Tests completed!" -ForegroundColor Green
}

function Build-Production {
    Write-Header
    Write-Host "🔨 Building for production..." -ForegroundColor Yellow

    # Build Dashboard
    if (Test-Path "dashboard/transaction-dashboard") {
        Write-Host "Building Dashboard..." -ForegroundColor Cyan
        Push-Location dashboard/transaction-dashboard
        npm run build
        Pop-Location
        Write-Host ""
    }

    # Build API
    if (Test-Path "api") {
        Write-Host "Building API..." -ForegroundColor Cyan
        Push-Location api
        npm run build
        Pop-Location
        Write-Host ""
    }

    Write-Host "✅ Build completed!" -ForegroundColor Green
}

function Start-Dashboard {
    Write-Header
    Write-Host "🎯 Starting dashboard only..." -ForegroundColor Green

    & make dashboard
}

# Main command processing
switch ($Command) {
    "help" { Show-Help }
    "install" { Install-Dependencies }
    "start" { Start-System }
    "stop" { Stop-System }
    "clean" { Clean-System }
    "dev" { Start-Dev }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "test" { Run-Tests }
    "build" { Build-Production }
    "dashboard" { Start-Dashboard }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}