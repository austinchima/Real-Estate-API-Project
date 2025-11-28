# View CloudWatch Logs for ECS Task

param(
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [int]$Minutes = 10
)

$logGroup = "/ecs/real-estate-api-task"

Write-Host "Fetching logs from last $Minutes minutes..." -ForegroundColor Yellow
Write-Host ""

# Get log streams
$streams = aws logs describe-log-streams `
    --log-group-name $logGroup `
    --order-by LastEventTime `
    --descending `
    --max-items 5 `
    --region $Region | ConvertFrom-Json

if ($streams.logStreams.Count -eq 0) {
    Write-Host "No log streams found" -ForegroundColor Red
    exit 1
}

Write-Host "Found $($streams.logStreams.Count) log stream(s)" -ForegroundColor Green
Write-Host ""

# Get the most recent stream
$latestStream = $streams.logStreams[0].logStreamName

Write-Host "Latest log stream: $latestStream" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get log events
$startTime = [DateTimeOffset]::UtcNow.AddMinutes(-$Minutes).ToUnixTimeMilliseconds()

$events = aws logs get-log-events `
    --log-group-name $logGroup `
    --log-stream-name $latestStream `
    --start-time $startTime `
    --region $Region | ConvertFrom-Json

if ($events.events.Count -eq 0) {
    Write-Host "No log events found in the last $Minutes minutes" -ForegroundColor Yellow
} else {
    foreach ($event in $events.events) {
        $timestamp = [DateTimeOffset]::FromUnixTimeMilliseconds($event.timestamp).LocalDateTime
        Write-Host "[$timestamp] $($event.message)"
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "To follow logs in real-time, use:" -ForegroundColor Yellow
Write-Host "  aws logs tail $logGroup --follow --region $Region" -ForegroundColor Cyan
Write-Host ""
