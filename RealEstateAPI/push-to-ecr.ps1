# Push Real Estate API to AWS ECR
# Automatically detects AWS account ID
$AWS_REGION = "us-east-1"
$ECR_REPOSITORY = "real-estate-api"
$IMAGE_TAG = "latest"

Write-Host "Getting AWS Account ID..." -ForegroundColor Yellow
$AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to get AWS Account ID. Run 'aws configure' first." -ForegroundColor Red
    exit 1
}
Write-Host "Account ID: $AWS_ACCOUNT_ID" -ForegroundColor Green

Write-Host "Building Docker image..." -ForegroundColor Green
docker build -t ${ECR_REPOSITORY}:${IMAGE_TAG} .

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Authenticating with ECR..." -ForegroundColor Green
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

if ($LASTEXITCODE -ne 0) {
    Write-Host "ECR authentication failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Tagging image..." -ForegroundColor Green
docker tag ${ECR_REPOSITORY}:${IMAGE_TAG} ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}

Write-Host "Pushing to ECR..." -ForegroundColor Green
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully pushed to ECR!" -ForegroundColor Green
    Write-Host "Image URI: ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}" -ForegroundColor Cyan
} else {
    Write-Host "Push to ECR failed!" -ForegroundColor Red
    exit 1
}
