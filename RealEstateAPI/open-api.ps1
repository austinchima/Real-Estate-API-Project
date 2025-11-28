# Open API in Browser

$region = "us-east-1"

Write-Host "Getting API endpoint..." -ForegroundColor Yellow

# Get running task
$taskArn = aws ecs list-tasks --cluster real-estate-cluster --region $region --desired-status RUNNING --query "taskArns[0]" --output text

if ([string]::IsNullOrEmpty($taskArn) -or $taskArn -eq "None") {
    Write-Host "✗ No running tasks found" -ForegroundColor Red
    Write-Host "Start a task first: .\launch-ecs-task.ps1" -ForegroundColor Yellow
    exit 1
}

# Get task details
$taskDetails = aws ecs describe-tasks --cluster real-estate-cluster --tasks $taskArn --region $region | ConvertFrom-Json

# Get ENI ID
$eniId = $null
foreach ($attachment in $taskDetails.tasks[0].attachments) {
    foreach ($detail in $attachment.details) {
        if ($detail.name -eq "networkInterfaceId") {
            $eniId = $detail.value
            break
        }
    }
}

if (-not $eniId) {
    Write-Host "✗ Could not find network interface" -ForegroundColor Red
    exit 1
}

# Get public IP
$publicIp = aws ec2 describe-network-interfaces --network-interface-ids $eniId --query "NetworkInterfaces[0].Association.PublicIp" --output text --region $region

if ([string]::IsNullOrEmpty($publicIp) -or $publicIp -eq "None") {
    Write-Host "✗ No public IP assigned" -ForegroundColor Red
    exit 1
}

$swaggerUrl = "http://$publicIp/swagger"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Opening API in Browser" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Swagger UI: $swaggerUrl" -ForegroundColor Cyan
Write-Host ""

# Open in default browser
Start-Process $swaggerUrl

Write-Host "✓ Browser opened!" -ForegroundColor Green
Write-Host ""
Write-Host "Other endpoints:" -ForegroundColor Yellow
Write-Host "  Properties: http://$publicIp/api/properties" -ForegroundColor Cyan
Write-Host "  Users:      http://$publicIp/api/users" -ForegroundColor Cyan
Write-Host "  Realtors:   http://$publicIp/api/realtors" -ForegroundColor Cyan
Write-Host ""
