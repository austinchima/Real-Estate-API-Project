# PowerShell script to verify RDS data
# This script helps verify that your RDS database has the required seed data

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RDS Data Verification Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "To verify your RDS database has been properly seeded, you need to:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Option 1: Using SQL Server Management Studio (SSMS)" -ForegroundColor Green
Write-Host "  1. Download SSMS: https://aka.ms/ssmsfullsetup" -ForegroundColor White
Write-Host "  2. Connect to your RDS instance:" -ForegroundColor White
Write-Host "     - Server name: [Your RDS Endpoint]" -ForegroundColor Gray
Write-Host "     - Authentication: SQL Server Authentication" -ForegroundColor Gray
Write-Host "     - Login: admin" -ForegroundColor Gray
Write-Host "     - Password: [Your RDS Password]" -ForegroundColor Gray
Write-Host "  3. Run these queries:" -ForegroundColor White
Write-Host ""
Write-Host "     SELECT COUNT(*) as PropertyCount FROM Properties;" -ForegroundColor Cyan
Write-Host "     SELECT COUNT(*) as UserCount FROM Users;" -ForegroundColor Cyan
Write-Host "     SELECT COUNT(*) as RealtorCount FROM Realtors;" -ForegroundColor Cyan
Write-Host ""
Write-Host "  4. Verify each count is >= 10" -ForegroundColor White
Write-Host ""

Write-Host "Option 2: Using Azure Data Studio (Cross-platform)" -ForegroundColor Green
Write-Host "  1. Download: https://aka.ms/azuredatastudio" -ForegroundColor White
Write-Host "  2. Create new connection:" -ForegroundColor White
Write-Host "     - Connection type: Microsoft SQL Server" -ForegroundColor Gray
Write-Host "     - Server: [Your RDS Endpoint]" -ForegroundColor Gray
Write-Host "     - Authentication: SQL Login" -ForegroundColor Gray
Write-Host "     - User name: admin" -ForegroundColor Gray
Write-Host "     - Password: [Your RDS Password]" -ForegroundColor Gray
Write-Host "     - Database: RealEstateDB" -ForegroundColor Gray
Write-Host "  3. Run the same queries as above" -ForegroundColor White
Write-Host ""

Write-Host "Option 3: Using dotnet ef (Command line)" -ForegroundColor Green
Write-Host "  Unfortunately, EF Core doesn't have a built-in query command" -ForegroundColor White
Write-Host "  You'll need to use SSMS or Azure Data Studio" -ForegroundColor White
Write-Host ""

Write-Host "Expected Results:" -ForegroundColor Yellow
Write-Host "  ✓ Properties table: 10 rows" -ForegroundColor White
Write-Host "  ✓ Users table: 10 rows" -ForegroundColor White
Write-Host "  ✓ Realtors table: 10 rows" -ForegroundColor White
Write-Host ""

Write-Host "Sample Data to Expect:" -ForegroundColor Yellow
Write-Host "  Properties: Various addresses in different cities" -ForegroundColor White
Write-Host "  Users: Different user accounts with emails" -ForegroundColor White
Write-Host "  Realtors: Real estate agents with license numbers" -ForegroundColor White
Write-Host ""

# Try to read connection string from appsettings.Production.json
if (Test-Path "appsettings.Production.json") {
    $settings = Get-Content "appsettings.Production.json" | ConvertFrom-Json
    $connectionString = $settings.ConnectionStrings.DefaultConnection
    
    if ($connectionString -and $connectionString -notmatch "YOUR_") {
        # Extract server from connection string
        if ($connectionString -match "Server=([^;]+)") {
            $server = $matches[1]
            Write-Host "Your RDS Endpoint: $server" -ForegroundColor Cyan
            Write-Host ""
        }
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "After verifying the data:" -ForegroundColor Yellow
Write-Host "  1. Confirm each table has 10+ rows" -ForegroundColor White
Write-Host "  2. Mark Task 9.2 as complete" -ForegroundColor White
Write-Host "  3. Mark Task 9 as complete" -ForegroundColor White
Write-Host "  4. Proceed to Task 10: Containerize API" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
