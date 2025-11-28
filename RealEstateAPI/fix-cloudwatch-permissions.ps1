# Fix CloudWatch Logs Permissions for ECS Task Execution Role
# This adds the missing logs:CreateLogGroup permission

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fix CloudWatch Permissions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$roleName = "ecsTaskExecutionRole"
$logGroupName = "/ecs/real-estate-api-task"
$region = "us-east-1"

Write-Host "Step 1: Create CloudWatch Log Group manually" -ForegroundColor Yellow
Write-Host ""

# Create the log group manually
Write-Host "Creating log group: $logGroupName" -ForegroundColor Yellow
$result = aws logs create-log-group --log-group-name $logGroupName --region $region 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Log group created successfully" -ForegroundColor Green
} elseif ($result -like "*ResourceAlreadyExistsException*") {
    Write-Host "✓ Log group already exists" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to create log group: $result" -ForegroundColor Red
    Write-Host ""
    Write-Host "Continuing anyway - will try to add permissions..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 2: Add CloudWatch Logs permissions to task execution role" -ForegroundColor Yellow
Write-Host ""

# Create inline policy for CloudWatch Logs
$policyJson = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Action = @(
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            )
            Resource = "arn:aws:logs:${region}:*:log-group:/ecs/*"
        }
    )
} | ConvertTo-Json -Depth 10

$policyJson | Out-File -FilePath "cloudwatch-policy.json" -Encoding utf8

Write-Host "Adding inline policy to role: $roleName" -ForegroundColor Yellow
aws iam put-role-policy `
    --role-name $roleName `
    --policy-name CloudWatchLogsPolicy `
    --policy-document file://cloudwatch-policy.json

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Policy added successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add policy" -ForegroundColor Red
    Remove-Item "cloudwatch-policy.json"
    exit 1
}

Remove-Item "cloudwatch-policy.json"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "PERMISSIONS FIXED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Wait 10 seconds for IAM changes to propagate" -ForegroundColor White
Write-Host "2. Launch a new task:" -ForegroundColor White
Write-Host "   .\launch-ecs-task.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Monitor logs:" -ForegroundColor White
Write-Host "   aws logs tail $logGroupName --follow --region $region" -ForegroundColor Cyan
Write-Host ""

Write-Host "Waiting 10 seconds for IAM propagation..." -ForegroundColor Yellow
Start-Sleep -Seconds 10
Write-Host "✓ Ready to launch task!" -ForegroundColor Green
Write-Host ""
