# Simple AWS ECS Deployment Script
param(
    [string]$Region = "us-east-1"
)

Write-Host "Real Estate API - Simple AWS Deployment" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Variables
$AccountId = (aws sts get-caller-identity --query Account --output text)
$EcrRepo = "real-estate-api"
$EcsCluster = "real-estate-cluster"
$TaskDef = "real-estate-api-task"
$ImageUri = "$AccountId.dkr.ecr.$Region.amazonaws.com/${EcrRepo}:latest"

Write-Host "Account ID: $AccountId" -ForegroundColor Green
Write-Host "Image URI: $ImageUri" -ForegroundColor Green

# Step 1: Create ECR Repository
Write-Host "`nStep 1: Creating ECR Repository..." -ForegroundColor Yellow
aws ecr create-repository --repository-name $EcrRepo --region $Region 2>$null
Write-Host "ECR Repository ready" -ForegroundColor Green

# Step 2: Build and Push Docker Image
Write-Host "`nStep 2: Building Docker Image..." -ForegroundColor Yellow
docker build -t ${EcrRepo}:latest .

Write-Host "Authenticating with ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "Tagging and pushing image..." -ForegroundColor Yellow
docker tag ${EcrRepo}:latest $ImageUri
docker push $ImageUri

Write-Host "Image pushed successfully!" -ForegroundColor Green

# Step 3: Create ECS Cluster
Write-Host "`nStep 3: Creating ECS Cluster..." -ForegroundColor Yellow
aws ecs create-cluster --cluster-name $EcsCluster --region $Region 2>$null
Write-Host "ECS Cluster ready" -ForegroundColor Green

# Step 4: Create IAM Role
Write-Host "`nStep 4: Creating IAM Role..." -ForegroundColor Yellow
$trustPolicy = @'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
'@

$trustPolicy | Out-File -FilePath "trust-policy.json" -Encoding utf8
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://trust-policy.json 2>$null
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" 2>$null
Remove-Item "trust-policy.json"
Write-Host "IAM Role ready" -ForegroundColor Green

# Step 5: Register Task Definition
Write-Host "`nStep 5: Registering Task Definition..." -ForegroundColor Yellow
$DbConnectionString = "Server=real-estate-db.c8jqo84sqtq1.us-east-1.rds.amazonaws.com;Database=RealEstateDB;User ID=admin;Password=real-estate-db;TrustServerCertificate=True;MultipleActiveResultSets=False;Encrypt=False"

$taskDef = @"
{
  "family": "$TaskDef",
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
          "value": "$DbConnectionString"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$TaskDef",
          "awslogs-region": "$Region",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      }
    }
  ]
}
"@

$taskDef | Out-File -FilePath "task-definition.json" -Encoding utf8
aws ecs register-task-definition --cli-input-json file://task-definition.json --region $Region
Remove-Item "task-definition.json"
Write-Host "Task Definition registered" -ForegroundColor Green

# Step 6: Create Security Group
Write-Host "`nStep 6: Creating Security Group..." -ForegroundColor Yellow
$VpcId = "vpc-03f5ea55d640ece91"
$SecurityGroupId = (aws ec2 create-security-group --group-name "real-estate-api-sg" --description "Real Estate API Security Group" --vpc-id $VpcId --region $Region --query "GroupId" --output text 2>$null)

if ([string]::IsNullOrEmpty($SecurityGroupId)) {
    $SecurityGroupId = (aws ec2 describe-security-groups --filters "Name=group-name,Values=real-estate-api-sg" "Name=vpc-id,Values=$VpcId" --query "SecurityGroups[0].GroupId" --output text --region $Region)
}

aws ec2 authorize-security-group-ingress --group-id $SecurityGroupId --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $Region 2>$null
aws ec2 authorize-security-group-ingress --group-id $SecurityGroupId --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $Region 2>$null

Write-Host "Security Group: $SecurityGroupId" -ForegroundColor Green

# Step 7: Get Subnet
Write-Host "`nStep 7: Getting Subnet..." -ForegroundColor Yellow
$Subnet = (aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VpcId" --query "Subnets[0].SubnetId" --output text --region $Region)
Write-Host "Using Subnet: $Subnet" -ForegroundColor Green

# Step 8: Run Task
Write-Host "`nStep 8: Launching ECS Task..." -ForegroundColor Yellow
$taskOutput = aws ecs run-task --cluster $EcsCluster --task-definition $TaskDef --launch-type FARGATE --network-configuration "awsvpcConfiguration={subnets=[$Subnet],securityGroups=[$SecurityGroupId],assignPublicIp=ENABLED}" --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDeployment initiated successfully!" -ForegroundColor Green
    Write-Host "Task is starting... (takes 1-2 minutes)" -ForegroundColor Yellow
    
    $taskArn = ($taskOutput | ConvertFrom-Json).tasks[0].taskArn
    Write-Host "Task ARN: $taskArn" -ForegroundColor Cyan
    
    Write-Host "`nTo get the public IP once running:" -ForegroundColor Yellow
    Write-Host "aws ecs describe-tasks --cluster $EcsCluster --tasks $taskArn --region $Region" -ForegroundColor Gray
    
    Write-Host "`nTo stop the task:" -ForegroundColor Yellow
    Write-Host "aws ecs stop-task --cluster $EcsCluster --task $taskArn --region $Region" -ForegroundColor Gray
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
}