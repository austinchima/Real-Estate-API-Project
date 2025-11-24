# ECS Task Troubleshooting Guide

## Issue: Tasks Stop Immediately After Starting

This is a common issue with several possible causes. Follow these steps to diagnose and fix.

---

## Step 1: Refresh AWS Credentials

AWS Academy credentials expire frequently. Always start here:

1. Go to AWS Academy → AWS Details
2. Click "Show" next to AWS CLI credentials
3. Copy all three lines (access key, secret key, session token)
4. Update `~/.aws/credentials`:

   ```powershell
   notepad $env:USERPROFILE\.aws\credentials
   ```

5. Verify: `aws sts get-caller-identity`

---

## Step 2: Run Diagnostics

```powershell
.\diagnose-ecs-task.ps1
```

This will show:

- Why the task stopped
- Container exit codes
- CloudWatch logs
- Common issues

---

## Step 3: Check CloudWatch Logs

The most common issues show up in logs:

**Via Script:**

```powershell
aws logs tail /ecs/real-estate-api-task --follow --region us-east-1
```

**Via AWS Console:**
<https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#logsV2:log-groups/log-group/$252Fecs$252Freal-estate-api-task>

**Look for:**

- Database connection errors
- Missing environment variables
- .NET exceptions
- Port binding issues

---

## Common Issues & Solutions

### 1. Database Connection Failure (Most Common)

**Symptoms:**

- Task stops within 5-10 seconds
- Logs show: "Unable to connect to database" or timeout errors

**Solutions:**

#### A. Fix Connection String Format

Your connection string must be complete (no placeholders):

**❌ Wrong:**

```
Server=endpoint;Database=RealEstateDB;User Id=admin;Password=${DB_PASSWORD};...
```

**✅ Correct:**

```
Server=real-estate-db.c8jqo84sqtq1.us-east-1.rds.amazonaws.com;Database=RealEstateDB;User Id=admin;Password=YourActualPassword123;TrustServerCertificate=True;MultipleActiveResultSets=true
```

#### B. Fix RDS Security Group

Your RDS must allow connections from ECS:

1. Go to RDS Console → Your Database → Connectivity & Security
2. Click on the VPC security group
3. Edit Inbound Rules
4. Add rule:
   - Type: MSSQL (1433)
   - Source: Custom → Select your ECS security group (real-estate-api-sg)
   - Or Source: Custom → 0.0.0.0/0 (for testing only)

#### C. Verify RDS is Accessible

```powershell
# Get RDS endpoint
aws rds describe-db-instances --region us-east-1 --query "DBInstances[0].Endpoint.Address"

# Check if publicly accessible
aws rds describe-db-instances --region us-east-1 --query "DBInstances[0].PubliclyAccessible"
```

For ECS to connect, RDS should either:

- Be in the same VPC as ECS (recommended)
- Be publicly accessible with proper security group rules

---

### 2. Application Startup Errors

**Symptoms:**

- Task stops immediately (< 5 seconds)
- Logs show .NET exceptions

**Solutions:**

#### Test Docker Image Locally First

```powershell
.\test-local-docker.ps1
```

This runs your container locally so you can see errors immediately.

#### Check for Missing Configuration

Ensure your task definition has:

```json
"environment": [
  {
    "name": "ASPNETCORE_ENVIRONMENT",
    "value": "Production"
  },
  {
    "name": "ConnectionStrings__DefaultConnection",
    "value": "Server=...;Database=...;User Id=...;Password=...;TrustServerCertificate=True"
  }
]
```

---

### 3. Resource Constraints

**Symptoms:**

- Task stops after running for a bit
- Logs show "OutOfMemory" or similar

**Solution:**

Increase CPU/Memory in task definition:

```powershell
# Current: 256 CPU (0.25 vCPU), 512 MB memory
# Try: 512 CPU (0.5 vCPU), 1024 MB memory
```

Edit the deployment script or task definition JSON to use:

```json
"cpu": "512",
"memory": "1024"
```

---

### 4. Image Pull Errors

**Symptoms:**

- Task stops before container starts
- Logs show "CannotPullContainerError"

**Solutions:**

#### Verify Image Exists in ECR

```powershell
aws ecr describe-images --repository-name real-estate-api --region us-east-1
```

#### Check Task Execution Role

```powershell
aws iam get-role --role-name ecsTaskExecutionRole
aws iam list-attached-role-policies --role-name ecsTaskExecutionRole
```

Should have: `AmazonECSTaskExecutionRolePolicy`

---

### 5. Port Configuration Issues

**Symptoms:**

- Container starts but health checks fail
- Can't access API even with public IP

**Solution:**

Verify Dockerfile exposes port 80:

```dockerfile
EXPOSE 80
```

Verify task definition maps port 80:

```json
"portMappings": [
  {
    "containerPort": 80,
    "protocol": "tcp"
  }
]
```

---

## Step-by-Step Debugging Process

### 1. Test Locally First

```powershell
# Build and run locally
.\test-local-docker.ps1

# Or manually:
docker build -t real-estate-api:test .
docker run -p 8080:80 -e "ConnectionStrings__DefaultConnection=YOUR_FULL_CONNECTION_STRING" real-estate-api:test

# Test in browser:
# http://localhost:8080/swagger
```

If it works locally but not in ECS → Network/Security issue
If it fails locally → Application/Configuration issue

### 2. Check RDS Connectivity

```powershell
# From your local machine, test if RDS is reachable
Test-NetConnection -ComputerName real-estate-db.c8jqo84sqtq1.us-east-1.rds.amazonaws.com -Port 1433
```

### 3. Review Task Definition

```powershell
aws ecs describe-task-definition --task-definition real-estate-api-task --region us-east-1
```

Check:

- ✓ Image URI is correct
- ✓ Environment variables are set
- ✓ Connection string has no placeholders
- ✓ Port mappings are correct

### 4. Check Security Groups

```powershell
# ECS Security Group
aws ec2 describe-security-groups --group-names real-estate-api-sg --region us-east-1

# Should allow outbound to RDS (port 1433)
# Should allow inbound HTTP (port 80) from 0.0.0.0/0
```

### 5. Monitor Task Startup

```powershell
# Launch task
.\launch-ecs-task.ps1

# In another terminal, watch logs live
aws logs tail /ecs/real-estate-api-task --follow --region us-east-1
```

---

## Quick Fixes Checklist

- [ ] AWS credentials refreshed
- [ ] RDS connection string is complete (no ${DB_PASSWORD})
- [ ] RDS security group allows inbound from ECS security group on port 1433
- [ ] Docker image builds successfully locally
- [ ] Container runs successfully locally with same connection string
- [ ] Task execution role has ECR permissions
- [ ] Task definition has correct environment variables
- [ ] CloudWatch logs checked for specific errors

---

## Get Help

If still stuck, gather this info:

```powershell
# 1. Task stopped reason
.\diagnose-ecs-task.ps1

# 2. CloudWatch logs
aws logs tail /ecs/real-estate-api-task --since 30m --region us-east-1 > logs.txt

# 3. Task definition
aws ecs describe-task-definition --task-definition real-estate-api-task --region us-east-1 > task-def.json

# 4. Security groups
aws ec2 describe-security-groups --group-names real-estate-api-sg --region us-east-1 > sg.json
```

Share these files for detailed troubleshooting.

---

## Most Likely Fix

**90% of the time, it's one of these:**

1. **Database connection string has placeholder** → Replace `${DB_PASSWORD}` with actual password
2. **RDS security group blocks ECS** → Add inbound rule for port 1433 from ECS security group
3. **RDS not in same VPC** → Ensure RDS and ECS are in vpc-03f5ea55d640ece91
4. **AWS credentials expired** → Refresh from AWS Academy

Try these first!
