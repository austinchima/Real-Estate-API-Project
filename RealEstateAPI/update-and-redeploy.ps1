# Quick Update and Redeploy Script
# Rebuilds image, pushes to ECR, and restarts task

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update and Redeploy" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get account ID
$AccountId = aws sts get-caller-identity --query Account --output text
$EcrUri = "$AccountId.dkr.ecr.$Region.amazonaws.com"
$ImageName = "real-estate-api"
$FullImageName = "$EcrUri/${ImageName}:latest"

Write-Host "Step 1: Build Docker image" -ForegroundColor Yellow
docker build -t ${ImageName}:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Authenticate with ECR" -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrUri
Write-Host "✓ Authenticated" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Tag and push image" -ForegroundColor Yellow
docker tag ${ImageName}:latest $FullImageName
docker push $FullImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Push failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Image pushed" -ForegroundColor Green
Write-Host ""

Write-Host "Step 4: Stop current task" -ForegroundColor Yellow
$taskArn = aws ecs list-tasks --cluster real-estate-cluster --region $Region --desired-status RUNNING --query "taskArns[0]" --output text

if ($taskArn -and $taskArn -ne "None") {
    aws ecs stop-task --cluster real-estate-cluster --task $taskArn --region $Region | Out-Null
    Write-Host "✓ Stopped old task" -ForegroundColor Green
    Write-Host "Waiting 10 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "No running task to stop" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 5: Launch new task" -ForegroundColor Yellow
.\launch-ecs-task.ps1

Write-Host ""
Write-Host "Step 6: Wait for task to start" -ForegroundColor Yellow
Write-Host "Waiting 30 seconds for task to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "Step 7: Get endpoint" -ForegroundColor Yellow
.\get-ecs-endpoint.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "REDEPLOY COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
