# Quick Deploy Script
param([string]$Region = "us-east-1")

Write-Host "Deploying Real Estate API to Production..." -ForegroundColor Cyan

# Variables
$AccountId = aws sts get-caller-identity --query Account --output text
$EcrUri = "$AccountId.dkr.ecr.$Region.amazonaws.com"
$ImageName = "real-estate-api"
$FullImageName = "$EcrUri/${ImageName}:latest"

# Step 1: Build Docker image
Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t ${ImageName}:latest .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Authenticate with ECR
Write-Host "Authenticating with ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrUri

# Step 3: Tag and push image
Write-Host "Pushing image to ECR..." -ForegroundColor Yellow
docker tag ${ImageName}:latest $FullImageName
docker push $FullImageName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Stop current task
Write-Host "Stopping current task..." -ForegroundColor Yellow
$taskArn = aws ecs list-tasks --cluster real-estate-cluster --region $Region --desired-status RUNNING --query "taskArns[0]" --output text

if ($taskArn -and $taskArn -ne "None") {
    aws ecs stop-task --cluster real-estate-cluster --task $taskArn --region $Region | Out-Null
    Write-Host "Stopped old task" -ForegroundColor Green
    Start-Sleep -Seconds 15
}

# Step 5: Launch new task
Write-Host "Launching new task..." -ForegroundColor Yellow
$SubnetId = "subnet-0582b34aec4cbb88c"
$SecurityGroupId = "sg-0fb272ee458f6ebaa"

$runTaskOutput = aws ecs run-task --cluster real-estate-cluster --task-definition real-estate-api-task --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[$SubnetId],securityGroups=[$SecurityGroupId],assignPublicIp=ENABLED}" --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host "Task launched successfully!" -ForegroundColor Green
    
    # Wait and get endpoint
    Write-Host "Waiting for task to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Get public IP
    $newTaskArn = aws ecs list-tasks --cluster real-estate-cluster --region $Region --desired-status RUNNING --query "taskArns[0]" --output text
    if ($newTaskArn -and $newTaskArn -ne "None") {
        $publicIp = aws ecs describe-tasks --cluster real-estate-cluster --tasks $newTaskArn --region $Region --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text
        if ($publicIp) {
            $endpoint = aws ec2 describe-network-interfaces --network-interface-ids $publicIp --region $Region --query "NetworkInterfaces[0].Association.PublicIp" --output text
            Write-Host ""
            Write-Host "API Endpoint: http://$endpoint/swagger" -ForegroundColor Green
            Write-Host "API Base URL: http://$endpoint" -ForegroundColor Green
        }
    }
} else {
    Write-Host "Failed to launch task!" -ForegroundColor Red
}

Write-Host ""
Write-Host "Deployment Complete!" -ForegroundColor Cyan