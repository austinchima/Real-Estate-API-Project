# PowerShell script to migrate database to AWS RDS
# Run this after you've updated appsettings.Production.json with your RDS connection string

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Real Estate API - RDS Migration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "RealEstateAPI.csproj")) {
    Write-Host "ERROR: Please run this script from the RealEstateAPI directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Check if appsettings.Production.json exists
if (-not (Test-Path "appsettings.Production.json")) {
    Write-Host "ERROR: appsettings.Production.json not found" -ForegroundColor Red
    Write-Host "Please create this file with your RDS connection string" -ForegroundColor Yellow
    exit 1
}

# Check if connection string has been updated
$productionSettings = Get-Content "appsettings.Production.json" -Raw
if ($productionSettings -match "YOUR_RDS_ENDPOINT" -or $productionSettings -match "YOUR_PASSWORD") {
    Write-Host "ERROR: Please update appsettings.Production.json with your actual RDS connection details" -ForegroundColor Red
    Write-Host "Replace YOUR_RDS_ENDPOINT and YOUR_PASSWORD with real values" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Setting environment to Production..." -ForegroundColor Green
$env:ASPNETCORE_ENVIRONMENT = "Production"
Write-Host "Environment set to: $env:ASPNETCORE_ENVIRONMENT" -ForegroundColor Gray
Write-Host ""

Write-Host "Step 2: Testing database connection..." -ForegroundColor Green
Write-Host "This will attempt to connect to your RDS instance..." -ForegroundColor Gray
Write-Host ""

# Try to run migrations
Write-Host "Step 3: Running EF Core migrations..." -ForegroundColor Green
Write-Host "Command: dotnet ef database update" -ForegroundColor Gray
Write-Host ""

try {
    dotnet ef database update
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✓ Migration Successful!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "Your RDS database has been created and seeded with data." -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Verify data in your database using SSMS or Azure Data Studio" -ForegroundColor White
        Write-Host "2. Check that each table (Properties, Users, Realtors) has 10+ rows" -ForegroundColor White
        Write-Host "3. Mark Task 9.2 as complete in your tasks.md" -ForegroundColor White
        Write-Host ""
    } else {
        throw "Migration failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ Migration Failed" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Verify your RDS instance is 'Available' in AWS Console" -ForegroundColor White
    Write-Host "2. Check security group allows your IP on port 1433 (SQL Server) or 5432 (PostgreSQL)" -ForegroundColor White
    Write-Host "3. Verify connection string in appsettings.Production.json is correct" -ForegroundColor White
    Write-Host "4. Test connection using SSMS or Azure Data Studio" -ForegroundColor White
    Write-Host "5. Check AWS RDS logs for connection errors" -ForegroundColor White
    Write-Host ""
    Write-Host "See AWS_RDS_SETUP.md for detailed troubleshooting" -ForegroundColor Cyan
    exit 1
}

# Reset environment
Write-Host "Resetting environment to Development..." -ForegroundColor Gray
$env:ASPNETCORE_ENVIRONMENT = "Development"
