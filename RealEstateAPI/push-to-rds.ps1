# Push database updates to AWS RDS

Write-Host "Starting database migration to AWS RDS..." -ForegroundColor Green

# Step 1: Apply migrations
Write-Host "Applying Entity Framework migrations..." -ForegroundColor Yellow
dotnet ef database update --configuration Release

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Migrations applied successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Migration failed" -ForegroundColor Red
    exit 1
}

# Step 2: Build the project
Write-Host "Building project..." -ForegroundColor Yellow
dotnet build -c Release

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}

# Step 3: Push to ECR
Write-Host "Pushing Docker image to ECR..." -ForegroundColor Yellow
.\push-to-ecr.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Image pushed to ECR" -ForegroundColor Green
} else {
    Write-Host "✗ ECR push failed" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy to ECS
Write-Host "Deploying to ECS Fargate..." -ForegroundColor Yellow
.\deploy-to-aws.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Deployment successful" -ForegroundColor Green
    Write-Host "Database updates pushed to RDS and API deployed!" -ForegroundColor Green
} else {
    Write-Host "✗ Deployment failed" -ForegroundColor Red
    exit 1
}
