# Launch ECS Task on Fargate
# Use this after you've pushed image and registered task definition

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$true)]
    [string]$ClusterName,
    
    [Parameter(Mandatory=$false)]
    [string]$TaskDefinition = "real-estate-api-task",
    
    [Parameter(Mandatory=$true)]
    [string]$SubnetId,
    
    [Parameter(Mandatory=$true)]
    [string]$SecurityGroupId
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Launching ECS Task on Fargate" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Cluster: $ClusterName" -ForegroundColor Yellow
Write-Host "Task Definition: $TaskDefinition" -ForegroundColor Yellow
Write-Host "Subnet: $SubnetId" -ForegroundColor Yellow
Write-Host "Security Group: $SecurityGroupId" -ForegroundColor Yellow

Write-Host ""
Write-Host "Launching task..." -ForegroundColor Yellow

$runTaskOutput = aws ecs run-task `
    --cluster $ClusterName `
    --task-definition $TaskDefinition `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$SubnetId],securityGroups=[$SecurityGroupId],assignPublicIp=ENABLED}" `
    --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Task launched successfully!" -ForegroundColor Green
    
    $taskArn = ($runTaskOutput | ConvertFrom-Json).tasks[0].taskArn
    Write-Host ""
    Write-Host "Task ARN: $taskArn" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Waiting for task to start (30 seconds)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    Write-Host ""
    Write-Host "Getting public IP..." -ForegroundColor Yellow
    Write-Host "Run this command to get the endpoint:" -ForegroundColor Yellow
    Write-Host "  .\get-ecs-endpoint.ps1" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✗ Failed to launch task" -ForegroundColor Red
    Write-Host "Error: $runTaskOutput" -ForegroundColor Red
}
