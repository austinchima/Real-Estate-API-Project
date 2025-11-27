# Quick Deployment Guide - Existing Infrastructure

You already have: ECR, ECS Cluster, RDS, VPC, Subnets, Security Groups

## Option 1: One-Command Deployment (Recommended)

```powershell
.\deploy-existing-infra.ps1 `
  -ClusterName "YOUR-CLUSTER-NAME" `
  -SubnetId "subnet-xxxxx" `
  -SecurityGroupId "sg-xxxxx" `
  -RdsConnectionString "Server=your-rds-endpoint.rds.amazonaws.com;Database=RealEstateDB;User Id=admin;Password=real-estate-db;TrustServerCertificate=True;MultipleActiveResultSets=true"
```

This script will:
1. Build Docker image
2. Push to ECR
3. Register task definition
4. Launch ECS task
5. Display public IP

---

## Option 2: Step-by-Step

### Step 1: Push Docker Image to ECR
```powershell
.\push-to-ecr.ps1
```

### Step 2: Register Task Definition
Edit `task-definition.json`:
- Update account ID (line 7)
- Update RDS connection string (line 22)

```powershell
aws logs create-log-group --log-group-name /ecs/real-estate-api-task --region us-east-1
aws ecs register-task-definition --cli-input-json file://task-definition.json --region us-east-1
```

### Step 3: Launch Task
```powershell
.\launch-ecs-task.ps1 `
  -ClusterName "YOUR-CLUSTER-NAME" `
  -SubnetId "subnet-xxxxx" `
  -SecurityGroupId "sg-xxxxx"
```

### Step 4: Get Public IP
```powershell
.\get-ecs-endpoint.ps1 -ClusterName "YOUR-CLUSTER-NAME"
```

---

## Quick Commands

**View logs:**
```powershell
aws logs tail /ecs/real-estate-api-task --follow --region us-east-1
```

**List running tasks:**
```powershell
aws ecs list-tasks --cluster YOUR-CLUSTER-NAME --region us-east-1
```

**Stop task:**
```powershell
aws ecs stop-task --cluster YOUR-CLUSTER-NAME --task TASK-ARN --region us-east-1
```

**Update and redeploy:**
```powershell
# Make code changes, then:
.\push-to-ecr.ps1
.\launch-ecs-task.ps1 -ClusterName "YOUR-CLUSTER" -SubnetId "subnet-xxx" -SecurityGroupId "sg-xxx"
```

---

## What You Need

Before running scripts, gather:
1. **ECS Cluster Name** - From AWS Console → ECS → Clusters
2. **Subnet ID** - From AWS Console → VPC → Subnets (use a public subnet)
3. **Security Group ID** - From AWS Console → EC2 → Security Groups (must allow port 80)
4. **RDS Connection String** - Your database endpoint

---

## Security Group Requirements

Your security group MUST have:
- **Inbound Rule:** HTTP (port 80) from 0.0.0.0/0

To add:
```powershell
aws ec2 authorize-security-group-ingress --group-id sg-xxxxx --protocol tcp --port 80 --cidr 0.0.0.0/0 --region us-east-1
```

---

## Troubleshooting

**Task fails to start:**
- Check CloudWatch logs: `aws logs tail /ecs/real-estate-api-task --follow`
- Verify RDS connection string is correct
- Ensure security group allows port 80

**Can't connect to API:**
- Verify task is RUNNING: `.\get-ecs-endpoint.ps1`
- Check security group allows inbound port 80
- Ensure subnet has internet gateway attached

**Docker build fails:**
- Make sure you're in RealEstateAPI directory
- Check Docker Desktop is running

---

## Next Steps After Deployment

1. **Test API:** `http://PUBLIC-IP/swagger`
2. **Configure APigee:** Point to `http://PUBLIC-IP`
3. **Deploy Frontend:** Update `.env` with APigee URL
4. **Upload to S3:** `aws s3 sync dist/ s3://your-bucket`
