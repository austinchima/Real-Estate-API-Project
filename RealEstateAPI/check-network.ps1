# Check Network Configuration

$region = "us-east-1"
$vpcId = "vpc-03f5ea55d640ece91"
$sgId = "sg-0fb272ee458f6ebaa"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Network Configuration Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get task details
Write-Host "Getting task details..." -ForegroundColor Yellow
$taskArn = (aws ecs list-tasks --cluster real-estate-cluster --region $region --desired-status RUNNING --query "taskArns[0]" --output text)

if ([string]::IsNullOrEmpty($taskArn) -or $taskArn -eq "None") {
    Write-Host "✗ No running tasks found" -ForegroundColor Red
    exit 1
}

$taskDetails = aws ecs describe-tasks --cluster real-estate-cluster --tasks $taskArn --region $region | ConvertFrom-Json
$task = $taskDetails.tasks[0]

# Get subnet from task
$subnetId = $null
foreach ($attachment in $task.attachments) {
    foreach ($detail in $attachment.details) {
        if ($detail.name -eq "subnetId") {
            $subnetId = $detail.value
            break
        }
    }
}

Write-Host "✓ Task is running" -ForegroundColor Green
Write-Host "  Subnet: $subnetId" -ForegroundColor White
Write-Host ""

# Check subnet route table
Write-Host "Checking subnet route table..." -ForegroundColor Yellow
$routeTables = aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=$subnetId" --region $region | ConvertFrom-Json

if ($routeTables.RouteTables.Count -eq 0) {
    # Check main route table
    $routeTables = aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$vpcId" "Name=association.main,Values=true" --region $region | ConvertFrom-Json
}

$hasInternetGateway = $false
foreach ($rt in $routeTables.RouteTables) {
    foreach ($route in $rt.Routes) {
        if ($route.GatewayId -like "igw-*") {
            $hasInternetGateway = $true
            Write-Host "✓ Internet Gateway found: $($route.GatewayId)" -ForegroundColor Green
            break
        }
    }
}

if (-not $hasInternetGateway) {
    Write-Host "✗ No Internet Gateway route found!" -ForegroundColor Red
    Write-Host "  This subnet cannot receive inbound traffic from the internet" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Solution: Use a public subnet with IGW route" -ForegroundColor Yellow
}

Write-Host ""

# Check if subnet auto-assigns public IPs
Write-Host "Checking subnet configuration..." -ForegroundColor Yellow
$subnet = aws ec2 describe-subnets --subnet-ids $subnetId --region $region | ConvertFrom-Json
$autoAssignPublicIp = $subnet.Subnets[0].MapPublicIpOnLaunch

if ($autoAssignPublicIp) {
    Write-Host "✓ Subnet auto-assigns public IPs" -ForegroundColor Green
} else {
    Write-Host "⚠ Subnet does not auto-assign public IPs" -ForegroundColor Yellow
    Write-Host "  (This is OK if assignPublicIp=ENABLED in task config)" -ForegroundColor Gray
}

Write-Host ""

# List all subnets in VPC
Write-Host "All subnets in VPC:" -ForegroundColor Yellow
$allSubnets = aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpcId" --region $region | ConvertFrom-Json

foreach ($sub in $allSubnets.Subnets) {
    $isPublic = $sub.MapPublicIpOnLaunch
    $color = if ($isPublic) { "Green" } else { "Yellow" }
    $type = if ($isPublic) { "PUBLIC" } else { "PRIVATE" }
    Write-Host "  $($sub.SubnetId) - $type - $($sub.AvailabilityZone)" -ForegroundColor $color
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Recommendation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $hasInternetGateway) {
    Write-Host "Your task is in a private subnet without internet access." -ForegroundColor Red
    Write-Host ""
    Write-Host "To fix this, you need to:" -ForegroundColor Yellow
    Write-Host "1. Create an Internet Gateway and attach it to your VPC" -ForegroundColor White
    Write-Host "2. Update the route table to route 0.0.0.0/0 to the IGW" -ForegroundColor White
    Write-Host "3. Or use a different subnet that already has IGW routing" -ForegroundColor White
    Write-Host ""
    Write-Host "Quick fix command:" -ForegroundColor Yellow
    Write-Host "  # Create IGW" -ForegroundColor Gray
    Write-Host "  aws ec2 create-internet-gateway --region $region" -ForegroundColor Cyan
    Write-Host "  # Attach to VPC" -ForegroundColor Gray
    Write-Host "  aws ec2 attach-internet-gateway --internet-gateway-id igw-xxxxx --vpc-id $vpcId --region $region" -ForegroundColor Cyan
    Write-Host "  # Add route" -ForegroundColor Gray
    Write-Host "  aws ec2 create-route --route-table-id rtb-xxxxx --destination-cidr-block 0.0.0.0/0 --gateway-id igw-xxxxx --region $region" -ForegroundColor Cyan
} else {
    Write-Host "Network configuration looks correct." -ForegroundColor Green
    Write-Host "The issue might be with the application itself." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Check application logs:" -ForegroundColor Yellow
    Write-Host "  .\view-logs.ps1" -ForegroundColor Cyan
}

Write-Host ""
