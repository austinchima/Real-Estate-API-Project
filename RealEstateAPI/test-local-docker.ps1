# Test Docker Image Locally Before Deploying
# This helps identify issues before pushing to ECS

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Docker Image Locally" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check if Dockerfile exists
if (-not (Test-Path "Dockerfile")) {
    Write-Host "✗ Dockerfile not found. Run this from RealEstateAPI directory." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Enter your RDS connection details:" -ForegroundColor Yellow
Write-Host ""

$rdsEndpoint = Read-Host "RDS Endpoint (e.g., real-estate-db.xxxxx.us-east-1.rds.amazonaws.com)"
$dbName = Read-Host "Database Name (default: RealEstateDB)" 
if ([string]::IsNullOrEmpty($dbName)) { $dbName = "RealEstateDB" }

$dbUser = Read-Host "Database User (default: admin)"
if ([string]::IsNullOrEmpty($dbUser)) { $dbUser = "admin" }

$dbPassword = Read-Host "Database Password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

# Build connection string
$connectionString = "Server=$rdsEndpoint;Database=$dbName;User Id=$dbUser;Password=$dbPasswordPlain;TrustServerCertificate=True;MultipleActiveResultSets=true"

Write-Host ""
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t real-estate-api:test .

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Docker build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker image built successfully" -ForegroundColor Green
Write-Host ""

Write-Host "Starting container on port 8080..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the container" -ForegroundColor Gray
Write-Host ""

# Run container
docker run -it --rm `
    -p 8080:80 `
    -e "ASPNETCORE_ENVIRONMENT=Production" `
    -e "ConnectionStrings__DefaultConnection=$connectionString" `
    real-estate-api:test

Write-Host ""
Write-Host "Container stopped." -ForegroundColor Yellow
