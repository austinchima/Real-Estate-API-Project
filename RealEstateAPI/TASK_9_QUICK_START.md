# Task 9 Quick Start Guide

## 🎯 Goal
Deploy your database to AWS RDS and migrate all data to the cloud.

## ⚡ Quick Steps

### 1️⃣ Create RDS Instance (15 min)

Go to: https://console.aws.amazon.com/rds/

```
✓ Click "Create database"
✓ Engine: SQL Server Express (or PostgreSQL)
✓ Template: Free tier
✓ DB identifier: realestate-db
✓ Master username: admin
✓ Master password: [Create strong password]
✓ Instance: db.t3.micro
✓ Storage: 20 GB
✓ Public access: Yes
✓ Initial database: RealEstateDB
✓ Click "Create database"
```

### 2️⃣ Configure Security Group (5 min)

```
✓ Go to RDS → Databases → realestate-db
✓ Click VPC security group
✓ Edit inbound rules
✓ Add rule: MSSQL (1433) or PostgreSQL (5432)
✓ Source: My IP
✓ Save rules
```

### 3️⃣ Update Connection String (2 min)

Edit `appsettings.Production.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_RDS_ENDPOINT;Database=RealEstateDB;User Id=admin;Password=YOUR_PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

Get YOUR_RDS_ENDPOINT from: RDS Console → Connectivity & security → Endpoint

### 4️⃣ Run Migration (2 min)

```powershell
cd RealEstateAPI
.\migrate-to-rds.ps1
```

### 5️⃣ Verify Data (5 min)

```powershell
.\verify-rds-data.ps1
```

Or connect with SSMS/Azure Data Studio and run:

```sql
SELECT COUNT(*) FROM Properties;  -- Should be 10
SELECT COUNT(*) FROM Users;       -- Should be 10
SELECT COUNT(*) FROM Realtors;    -- Should be 10
```

## ✅ Success Criteria

- [ ] RDS instance status: "Available"
- [ ] Security group allows your IP
- [ ] Migration completed without errors
- [ ] Properties table has 10 rows
- [ ] Users table has 10 rows
- [ ] Realtors table has 10 rows

## 📚 Need More Help?

- **Detailed guide**: See `AWS_RDS_SETUP.md`
- **Full instructions**: See `TASK_9_INSTRUCTIONS.md`
- **Troubleshooting**: Check TASK_9_INSTRUCTIONS.md → Troubleshooting section

## 🚨 Common Issues

**Can't connect?**
→ Check security group allows your IP on port 1433/5432

**Migration fails?**
→ Verify connection string is correct (no typos in endpoint/password)

**Timeout?**
→ Check RDS instance is "Available" and in correct region

## 💰 Cost

Free Tier: 750 hours/month (enough for 24/7 operation)

To avoid charges: Delete instance when done testing

## 🎉 Done?

Mark these as complete in `tasks.md`:
- [x] 9.1 Create AWS RDS instance
- [x] 9.2 Migrate database to AWS RDS
- [x] 9. Configure and deploy database to AWS RDS

Next: Task 10 - Containerize API with Docker
