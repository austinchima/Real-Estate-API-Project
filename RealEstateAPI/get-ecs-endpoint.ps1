# Get ECS Task Public Endpoint
# This script retrieves the public IP address of your running ECS task

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$ClusterName = "real-estate-cluster"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Getting ECS Task Public Endpoint" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if AWS CLI is installed
if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Host "✗ AWS CLI not found. Please install AWS CLI first." -ForegroundColor Red
    exit 1
}

Write-Host "Cluster: $ClusterName" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host ""

# Get running tasks
Write-Host "Getting running tasks..." -ForegroundColor Yellow
$taskArns = aws ecs list-tasks --cluster $ClusterName --region $Region --desired-status RUNNING --query "taskArns" --output json | ConvertFrom-Json

if ($taskArns.Count -eq 0) {
    Write-Host "✗ No running tasks found in cluster: $ClusterName" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start a task, run:" -ForegroundColor Yellow
    Write-Host "  .\deploy-to-aws.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host "✓ Found $($taskArns.Count) running task(s)" -ForegroundColor Green
Write-Host ""

foreach ($taskArn in $taskArns) {
    Write-Host "----------------------------------------" -ForegroundColor Cyan
    Write-Host "Task ARN: $taskArn" -ForegroundColor White
    
    # Get task details
    $taskDetails = aws ecs describe-tasks --cluster $ClusterName --tasks $taskArn --region $Region | ConvertFrom-Json
    
    $task = $taskDetails.tasks[0]
    $taskStatus = $task.lastStatus
    
    Write-Host "Status: $taskStatus" -ForegroundColor $(if ($taskStatus -eq "RUNNING") { "Green" } else { "Yellow" })
    
    # Get ENI ID
    $eniId = $null
    foreach ($attachment in $task.attachments) {
        foreach ($detail in $attachment.details) {
            if ($detail.name -eq "networkInterfaceId") {
                $eniId = $detail.value
                break
            }
        }
        if ($eniId) { break }
    }
    
    if ($eniId) {
        Write-Host "Network Interface: $eniId" -ForegroundColor White
        
        # Get public IP
        $publicIp = aws ec2 describe-network-interfaces --network-interface-ids $eniId --query "NetworkInterfaces[0].Association.PublicIp" --output text --region $Region
        
        if ($publicIp -and $publicIp -ne "None") {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "PUBLIC ENDPOINT FOUND!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "API Base URL:" -ForegroundColor Yellow
            Write-Host "  http://$publicIp" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Swagger UI:" -ForegroundColor Yellow
            Write-Host "  http://$publicIp/swagger" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "API Endpoints:" -ForegroundColor Yellow
            Write-Host "  Properties: http://$publicIp/api/properties" -ForegroundColor Cyan
            Write-Host "  Users:      http://$publicIp/api/users" -ForegroundColor Cyan
            Write-Host "  Realtors:   http://$publicIp/api/realtors" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Test with curl:" -ForegroundColor Yellow
            Write-Host "  curl http://$publicIp/api/properties" -ForegroundColor Gray
            Write-Host ""
        } else {
            Write-Host "⚠ Public IP not yet assigned (task may still be starting)" -ForegroundColor Yellow
            Write-Host "Wait a moment and run this script again." -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠ Network interface not found" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

Write-Host "To stop tasks:" -ForegroundColor Yellow
Write-Host "  aws ecs stop-task --cluster $ClusterName --task [TASK_ARN] --region $Region" -ForegroundColor Gray
Write-Host ""
