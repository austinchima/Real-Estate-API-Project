# Deploy to Existing AWS Infrastructure
# Use this when you already have: ECR repo, ECS cluster, RDS, VPC, subnets, security groups

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$true)]
    [string]$ClusterName,
    
    [Parameter(Mandatory=$true)]
    [string]$SubnetId,
    
    [Parameter(Mandatory=$true)]
    [string]$SecurityGroupId,
    
    [Parameter(Mandatory=$true)]
    [string]$RdsConnectionString,
    
    [Parameter(Mandatory=$false)]
    [string]$EcrRepository = "real-estate-api",
    
    [Parameter(Mandatory=$false)]
    [string]$TaskDefinitionName = "real-estate-api-task"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deploy to Existing AWS Infrastructure" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get AWS Account ID
Write-Host "Getting AWS Account ID..." -ForegroundColor Yellow
$AccountId = aws sts get-caller-identity --query Account --output text
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to get AWS Account ID. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}
Write-Host "Account ID: $AccountId" -ForegroundColor Green
Write-Host ""

$ImageUri = "$AccountId.dkr.ecr.$Region.amazonaws.com/${EcrRepository}:latest"

# Step 1: Build and Push Docker Image
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Build & Push Docker Image" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t ${EcrRepository}:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Build successful" -ForegroundColor Green

Write-Host "Authenticating with ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin ${AccountId}.dkr.ecr.${Region}.amazonaws.com
if ($LASTEXITCODE -ne 0) {
    Write-Host "ECR authentication failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Tagging image..." -ForegroundColor Yellow
docker tag ${EcrRepository}:latest $ImageUri

Write-Host "Pushing to ECR..." -ForegroundColor Yellow
docker push $ImageUri
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed!" -ForegroundColor Red
    exit 1
}
Write-Host "Image pushed successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Create CloudWatch Log Group
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Create CloudWatch Log Group" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$logGroupExists = aws logs describe-log-groups --log-group-name-prefix "/ecs/$TaskDefinitionName" --region $Region --query "logGroups[?logGroupName=='/ecs/$TaskDefinitionName']" --output text 2>$null

if ([string]::IsNullOrEmpty($logGroupExists)) {
    Write-Host "Creating log group..." -ForegroundColor Yellow
    aws logs create-log-group --log-group-name "/ecs/$TaskDefinitionName" --region $Region
    Write-Host "Log group created" -ForegroundColor Green
} else {
    Write-Host "Log group already exists" -ForegroundColor Green
}
Write-Host ""

# Step 3: Register Task Definition
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Register Task Definition" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$taskDef = @"
{
  "family": "$TaskDefinitionName",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::${AccountId}:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "real-estate-api",
      "image": "$ImageUri",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ASPNETCORE_ENVIRONMENT",
          "value": "Production"
        },
        {
          "name": "ConnectionStrings__DefaultConnection",
          "value": "$RdsConnectionString"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$TaskDefinitionName",
          "awslogs-region": "$Region",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
"@

$taskDef | Out-File -FilePath "task-definition-temp.json" -Encoding utf8

Write-Host "Registering task definition..." -ForegroundColor Yellow
aws ecs register-task-definition --cli-input-json file://task-definition-temp.json --region $Region | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to register task definition" -ForegroundColor Red
    Remove-Item "task-definition-temp.json"
    exit 1
}
Remove-Item "task-definition-temp.json"
Write-Host "Task definition registered" -ForegroundColor Green
Write-Host ""

# Step 4: Run ECS Task
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Run ECS Task" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Launching task..." -ForegroundColor Yellow
$runOutput = aws ecs run-task `
    --cluster $ClusterName `
    --task-definition $TaskDefinitionName `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$SubnetId],securityGroups=[$SecurityGroupId],assignPublicIp=ENABLED}" `
    --region $Region

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to launch task" -ForegroundColor Red
    exit 1
}

$taskArn = ($runOutput | ConvertFrom-Json).tasks[0].taskArn
Write-Host "Task launched: $taskArn" -ForegroundColor Green
Write-Host ""

# Step 5: Wait and Get Public IP
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 5: Get Public IP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Waiting for task to start (30 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

$taskDetails = aws ecs describe-tasks --cluster $ClusterName --tasks $taskArn --region $Region | ConvertFrom-Json
$eniId = $taskDetails.tasks[0].attachments[0].details | Where-Object { $_.name -eq "networkInterfaceId" } | Select-Object -ExpandProperty value

if ($eniId) {
    $publicIp = aws ec2 describe-network-interfaces --network-interface-ids $eniId --query "NetworkInterfaces[0].Association.PublicIp" --output text --region $Region
    
    if ($publicIp -and $publicIp -ne "None") {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "API Endpoint: http://$publicIp" -ForegroundColor Cyan
        Write-Host "Swagger UI: http://$publicIp/swagger" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Test with:" -ForegroundColor Yellow
        Write-Host "  curl http://$publicIp/api/properties" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Task ARN: $taskArn" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host "Task started but IP not yet available. Run:" -ForegroundColor Yellow
        Write-Host "  .\get-ecs-endpoint.ps1 -ClusterName $ClusterName" -ForegroundColor Cyan
    }
} else {
    Write-Host "Task started but network interface not found. Run:" -ForegroundColor Yellow
    Write-Host "  .\get-ecs-endpoint.ps1 -ClusterName $ClusterName" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "To view logs:" -ForegroundColor Yellow
Write-Host "  aws logs tail /ecs/$TaskDefinitionName --follow --region $Region" -ForegroundColor Gray
Write-Host ""
Write-Host "To stop task:" -ForegroundColor Yellow
Write-Host "  aws ecs stop-task --cluster $ClusterName --task $taskArn --region $Region" -ForegroundColor Gray
Write-Host ""
