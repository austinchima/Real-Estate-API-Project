# Diagnose ECS Task Issues
# This script checks why tasks are stopping

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [string]$ClusterName = "real-estate-cluster"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ECS Task Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get stopped tasks
Write-Host "Getting stopped tasks..." -ForegroundColor Yellow
$stoppedTasks = aws ecs list-tasks --cluster $ClusterName --region $Region --desired-status STOPPED --query "taskArns" --output json | ConvertFrom-Json

if ($stoppedTasks.Count -eq 0) {
    Write-Host "No stopped tasks found." -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($stoppedTasks.Count) stopped task(s)" -ForegroundColor Yellow
Write-Host ""

# Get the most recent stopped task
$latestTask = $stoppedTasks[0]

Write-Host "Analyzing most recent stopped task..." -ForegroundColor Yellow
Write-Host "Task ARN: $latestTask" -ForegroundColor White
Write-Host ""

# Get task details
$taskDetails = aws ecs describe-tasks --cluster $ClusterName --tasks $latestTask --region $Region | ConvertFrom-Json
$task = $taskDetails.tasks[0]

Write-Host "========================================" -ForegroundColor Red
Write-Host "TASK FAILURE DETAILS" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

Write-Host "Status: $($task.lastStatus)" -ForegroundColor Yellow
Write-Host "Stopped At: $($task.stoppedAt)" -ForegroundColor Yellow
Write-Host ""

Write-Host "Stopped Reason:" -ForegroundColor Red
Write-Host "  $($task.stoppedReason)" -ForegroundColor White
Write-Host ""

# Check container details
if ($task.containers) {
    foreach ($container in $task.containers) {
        Write-Host "Container: $($container.name)" -ForegroundColor Cyan
        Write-Host "  Exit Code: $($container.exitCode)" -ForegroundColor $(if ($container.exitCode -eq 0) { "Green" } else { "Red" })
        
        if ($container.reason) {
            Write-Host "  Reason: $($container.reason)" -ForegroundColor Yellow
        }
        Write-Host ""
    }
}

# Get CloudWatch logs
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CLOUDWATCH LOGS (Last 50 lines)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$logGroup = "/ecs/real-estate-api-task"

Write-Host "Fetching logs from: $logGroup" -ForegroundColor Yellow
Write-Host ""

try {
    $logs = aws logs tail $logGroup --since 30m --format short --region $Region 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host $logs
    } else {
        Write-Host "Could not fetch logs. Log group may not exist yet." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Try viewing logs in AWS Console:" -ForegroundColor Yellow
        Write-Host "  https://console.aws.amazon.com/cloudwatch/home?region=$Region#logsV2:log-groups/log-group/`$252Fecs`$252Freal-estate-api-task" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error fetching logs: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "COMMON ISSUES & SOLUTIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Database Connection Issues:" -ForegroundColor Yellow
Write-Host "   - Verify RDS connection string is correct" -ForegroundColor White
Write-Host "   - Check RDS security group allows connections from ECS security group" -ForegroundColor White
Write-Host "   - Ensure RDS is in the same VPC or publicly accessible" -ForegroundColor White
Write-Host ""

Write-Host "2. Application Startup Errors:" -ForegroundColor Yellow
Write-Host "   - Check CloudWatch logs above for .NET exceptions" -ForegroundColor White
Write-Host "   - Verify appsettings.json configuration" -ForegroundColor White
Write-Host "   - Test Docker image locally first" -ForegroundColor White
Write-Host ""

Write-Host "3. Resource Constraints:" -ForegroundColor Yellow
Write-Host "   - Task may need more CPU/Memory (currently 256 CPU, 512 MB)" -ForegroundColor White
Write-Host "   - Check if container is being OOM killed" -ForegroundColor White
Write-Host ""

Write-Host "4. Image Pull Errors:" -ForegroundColor Yellow
Write-Host "   - Verify ECR image exists and is accessible" -ForegroundColor White
Write-Host "   - Check task execution role has ECR permissions" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "To test Docker image locally:" -ForegroundColor Yellow
Write-Host "  docker run -p 8080:80 -e ConnectionStrings__DefaultConnection='YOUR_CONNECTION_STRING' real-estate-api:latest" -ForegroundColor Cyan
Write-Host ""

Write-Host "To view full logs in AWS Console:" -ForegroundColor Yellow
Write-Host "  https://console.aws.amazon.com/ecs/home?region=$Region#/clusters/$ClusterName/tasks" -ForegroundColor Cyan
Write-Host ""

Write-Host "To check RDS connectivity from ECS:" -ForegroundColor Yellow
Write-Host "  Ensure RDS security group allows inbound from ECS security group" -ForegroundColor Cyan
Write-Host ""
