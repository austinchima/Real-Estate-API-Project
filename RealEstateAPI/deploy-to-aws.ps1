# Real Estate API - AWS ECS Fargate Deployment Script
# This script handles ECR push, ECS cluster creation, task definition, and task launch

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$EcrRepositoryName = "real-estate-api",
    
    [Parameter(Mandatory=$false)]
    [string]$EcsClusterName = "real-estate-cluster",
    
    [Parameter(Mandatory=$false)]
    [string]$TaskDefinitionName = "real-estate-api-task",
    
    [Parameter(Mandatory=$false)]
    [string]$ImageTag = "latest"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Real Estate API - AWS Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Dockerfile exists in current directory
if (-not (Test-Path "Dockerfile")) {
    Write-Host "✗ Dockerfile not found in current directory." -ForegroundColor Red
    Write-Host "Please run this script from the RealEstateAPI directory:" -ForegroundColor Yellow
    Write-Host "  cd RealEstateAPI" -ForegroundColor Cyan
    Write-Host "  .\deploy-to-aws.ps1" -ForegroundColor Cyan
    exit 1
}

# Check if AWS CLI is installed
Write-Host "Checking AWS CLI installation..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "✓ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    Write-Host "Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Get AWS Account ID
Write-Host "Getting AWS Account ID..." -ForegroundColor Yellow
try {
    $AccountId = (aws sts get-caller-identity --query Account --output text)
    Write-Host "✓ AWS Account ID: $AccountId" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to get AWS Account ID. Please configure AWS credentials." -ForegroundColor Red
    Write-Host "Run: aws configure" -ForegroundColor Yellow
    exit 1
}

$EcrUri = "$AccountId.dkr.ecr.$Region.amazonaws.com"
$FullImageName = "$EcrUri/${EcrRepositoryName}:${ImageTag}"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Create ECR Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if ECR repository exists
Write-Host "Checking if ECR repository exists..." -ForegroundColor Yellow
$repoExists = aws ecr describe-repositories --repository-names $EcrRepositoryName --region $Region 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating ECR repository: $EcrRepositoryName" -ForegroundColor Yellow
    aws ecr create-repository --repository-name $EcrRepositoryName --region $Region --image-scanning-configuration scanOnPush=true
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ ECR repository created successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create ECR repository" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ ECR repository already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Build Docker Image" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Building Docker image..." -ForegroundColor Yellow
docker build -t $EcrRepositoryName`:$ImageTag .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker image built successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to build Docker image" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Authenticate Docker with ECR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Authenticating Docker with ECR..." -ForegroundColor Yellow
aws ecr get-login-password --region $Region | docker login --username AWS --password-stdin $EcrUri

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Docker authenticated with ECR" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to authenticate Docker with ECR" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Tag and Push Image to ECR" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Tagging image: $FullImageName" -ForegroundColor Yellow
docker tag ${EcrRepositoryName}:${ImageTag} $FullImageName

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Image tagged successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to tag image" -ForegroundColor Red
    exit 1
}

Write-Host "Pushing image to ECR..." -ForegroundColor Yellow
docker push $FullImageName

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Image pushed to ECR successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to push image to ECR" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 5: Create ECS Cluster" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if cluster exists
Write-Host "Checking if ECS cluster exists..." -ForegroundColor Yellow
$clusterExists = aws ecs describe-clusters --clusters $EcsClusterName --region $Region --query "clusters[0].status" --output text 2>$null

if ($clusterExists -eq "ACTIVE") {
    Write-Host "✓ ECS cluster already exists and is active" -ForegroundColor Green
} else {
    Write-Host "Creating ECS cluster: $EcsClusterName" -ForegroundColor Yellow
    aws ecs create-cluster --cluster-name $EcsClusterName --region $Region
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ ECS cluster created successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to create ECS cluster" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 6: Create IAM Role for ECS Task" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$TaskRoleName = "ecsTaskExecutionRole"
Write-Host "Checking if IAM role exists..." -ForegroundColor Yellow
$roleExists = aws iam get-role --role-name $TaskRoleName 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Creating IAM role for ECS task execution..." -ForegroundColor Yellow
    
    # Create trust policy
    $trustPolicy = @"
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
"@
    
    $trustPolicy | Out-File -FilePath "trust-policy.json" -Encoding utf8
    
    aws iam create-role --role-name $TaskRoleName --assume-role-policy-document file://trust-policy.json
    aws iam attach-role-policy --role-name $TaskRoleName --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
    
    Remove-Item "trust-policy.json"
    
    Write-Host "✓ IAM role created and policy attached" -ForegroundColor Green
    Write-Host "Waiting 10 seconds for IAM role to propagate..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
} else {
    Write-Host "✓ IAM role already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 7: Register Task Definition" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Creating task definition JSON..." -ForegroundColor Yellow

# Prompt for database connection string
Write-Host ""
Write-Host "Database Configuration Required:" -ForegroundColor Yellow
Write-Host "Please provide your AWS RDS connection string." -ForegroundColor Yellow
Write-Host "Example: Server=your-rds-endpoint.rds.amazonaws.com;Database=RealEstateDB;User Id=admin;Password=yourpassword;" -ForegroundColor Gray
$DbConnectionString = Read-Host "Server=YOUR_RDS_ENDPOINT;Database=RealEstateDB;User Id=admin;Password=real-estate-db;TrustServerCertificate=True;MultipleActiveResultSets=true"

$taskDefinition = @"
{
  "family": "$TaskDefinitionName",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::${AccountId}:role/${TaskRoleName}",
  "containerDefinitions": [
    {
      "name": "real-estate-api",
      "image": "$FullImageName",
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
          "awslogs-group": "/ecs/$TaskDefinitionName",
          "awslogs-region": "$Region",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      }
    }
  ]
}
"@

$taskDefinition | Out-File -FilePath "task-definition.json" -Encoding utf8

Write-Host "Registering task definition..." -ForegroundColor Yellow
aws ecs register-task-definition --cli-input-json file://task-definition.json --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Task definition registered successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to register task definition" -ForegroundColor Red
    Remove-Item "task-definition.json"
    exit 1
}

Remove-Item "task-definition.json"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 8: Get VPC and Subnet Information" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Use specified VPC ID
$VpcId = "vpc-03f5ea55d640ece91"
Write-Host "✓ Using VPC ID: $VpcId" -ForegroundColor Green

Write-Host "Getting public subnets..." -ForegroundColor Yellow
$Subnets = aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VpcId" --query "Subnets[*].SubnetId" --output text --region $Region

if ([string]::IsNullOrEmpty($Subnets)) {
    Write-Host "✗ No subnets found in VPC" -ForegroundColor Red
    exit 1
}

$SubnetList = $Subnets -split '\s+'
Write-Host "✓ Found subnets: $($SubnetList -join ', ')" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 9: Create Security Group" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$SecurityGroupName = "real-estate-api-sg"
Write-Host "Checking if security group exists..." -ForegroundColor Yellow

$existingSg = aws ec2 describe-security-groups --filters "Name=group-name,Values=$SecurityGroupName" "Name=vpc-id,Values=$VpcId" --query "SecurityGroups[0].GroupId" --output text --region $Region 2>$null

if ([string]::IsNullOrEmpty($existingSg) -or $existingSg -eq "None") {
    Write-Host "Creating security group..." -ForegroundColor Yellow
    $SecurityGroupId = aws ec2 create-security-group --group-name $SecurityGroupName --description "Security group for Real Estate API" --vpc-id $VpcId --region $Region --query "GroupId" --output text
    
    Write-Host "Adding inbound rules for HTTP (80) and HTTPS (443)..." -ForegroundColor Yellow
    aws ec2 authorize-security-group-ingress --group-id $SecurityGroupId --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $Region
    aws ec2 authorize-security-group-ingress --group-id $SecurityGroupId --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $Region
    
    Write-Host "✓ Security group created: $SecurityGroupId" -ForegroundColor Green
} else {
    $SecurityGroupId = $existingSg
    Write-Host "✓ Security group already exists: $SecurityGroupId" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 10: Run ECS Task on Fargate" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Launching ECS task..." -ForegroundColor Yellow

$runTaskOutput = aws ecs run-task `
    --cluster $EcsClusterName `
    --task-definition $TaskDefinitionName `
    --launch-type FARGATE `
    --network-configuration "awsvpcConfiguration={subnets=[$($SubnetList[0])],securityGroups=[$SecurityGroupId],assignPublicIp=ENABLED}" `
    --region $Region

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ ECS task launched successfully" -ForegroundColor Green
    
    # Extract task ARN
    $taskArn = ($runTaskOutput | ConvertFrom-Json).tasks[0].taskArn
    Write-Host "Task ARN: $taskArn" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "Waiting for task to start (this may take 1-2 minutes)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
    
    # Get task details
    $taskDetails = aws ecs describe-tasks --cluster $EcsClusterName --tasks $taskArn --region $Region | ConvertFrom-Json
    
    $taskStatus = $taskDetails.tasks[0].lastStatus
    Write-Host "Task Status: $taskStatus" -ForegroundColor Cyan
    
    # Get public IP
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
            Write-Host "Test the API with:" -ForegroundColor Yellow
            Write-Host "  curl http://$publicIp/api/properties" -ForegroundColor Gray
            Write-Host ""
        } else {
            Write-Host "⚠ Task is starting but public IP not yet available" -ForegroundColor Yellow
            Write-Host "Check task status with: aws ecs describe-tasks --cluster $EcsClusterName --tasks $taskArn --region $Region" -ForegroundColor Gray
        }
    }
    
} else {
    Write-Host "✗ Failed to launch ECS task" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor White
Write-Host "ECR Repository: $EcrRepositoryName" -ForegroundColor White
Write-Host "Image: $FullImageName" -ForegroundColor White
Write-Host "ECS Cluster: $EcsClusterName" -ForegroundColor White
Write-Host "Task Definition: $TaskDefinitionName" -ForegroundColor White
Write-Host "Security Group: $SecurityGroupId" -ForegroundColor White
Write-Host ""
Write-Host "To stop the task:" -ForegroundColor Yellow
Write-Host "  aws ecs stop-task --cluster $EcsClusterName --task $taskArn --region $Region" -ForegroundColor Gray
Write-Host ""
