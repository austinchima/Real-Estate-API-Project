# Apply pending migrations to AWS RDS database
# This script uses the AWS RDS connection string and applies migrations

Write-Host "Applying migrations to AWS RDS database..." -ForegroundColor Cyan

# Load DB password from .env file
$dbPassword = "real-estate-db"
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match '^\s*DB_PASSWORD\s*=\s*(.*?)\s*$') {
            $dbPassword = $matches[1]
            Write-Host "Loaded DB_PASSWORD from .env" -ForegroundColor Gray
        }
    }
}

if ([string]::IsNullOrEmpty($dbPassword)) {
    Write-Host "✗ DB_PASSWORD not found in .env file!" -ForegroundColor Red
    exit 1
}

# Build the connection string with the actual password
$connectionString = "Server=real-estate-db.c8jqo84sqtq1.us-east-1.rds.amazonaws.com;Database=RealEstateDB;User Id=admin;Password=$dbPassword;TrustServerCertificate=True;MultipleActiveResultSets=true"

Write-Host "`nApplying migrations..." -ForegroundColor Yellow
dotnet ef database update --connection $connectionString --verbose

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nMigrations applied successfully to AWS RDS!" -ForegroundColor Green
} else {
    Write-Host "`nMigration failed. Check the error above." -ForegroundColor Red
    exit 1
}
