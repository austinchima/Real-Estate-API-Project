# Task 9: Configure and Deploy Database to AWS RDS

## Overview

This task involves creating an AWS RDS database instance and migrating your local database schema and seed data to the cloud. This is a critical step before deploying your API to AWS ECS.

## Prerequisites

- AWS Account (Free Tier eligible)
- AWS CLI installed (optional but helpful)
- SQL Server Management Studio or Azure Data Studio (for verification)
- Completed Tasks 1-3 (database models, migrations, and seed data)

## Task Breakdown

### Task 9.1: Create AWS RDS Instance ⏱️ ~15 minutes

**What you'll do:**

1. Create a new RDS database instance in AWS Console
2. Configure security group to allow connections
3. Note down the connection details

**Detailed Steps:**

See [AWS_RDS_SETUP.md](AWS_RDS_SETUP.md) for complete step-by-step instructions.

**Quick Summary:**

- Database engine: SQL Server Express (or PostgreSQL)
- Instance type: db.t3.micro (Free Tier)
- Storage: 20 GB
- Public access: Yes (for development)
- Initial database: RealEstateDB

**Deliverables:**

- ✅ RDS instance created and in "Available" status
- ✅ Security group configured to allow your IP
- ✅ Connection endpoint and credentials saved

---

### Task 9.2: Migrate Database to AWS RDS ⏱️ ~10 minutes

**What you'll do:**

1. Update connection string with RDS endpoint
2. Run EF Core migrations against RDS
3. Verify seed data exists

**Detailed Steps:**

#### Step 1: Update Connection String

Edit `appsettings.Production.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_RDS_ENDPOINT;Database=RealEstateDB;User Id=admin;Password=YOUR_PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

Replace:

- `YOUR_RDS_ENDPOINT`: Your RDS endpoint (e.g., `realestate-db.abc123.us-east-1.rds.amazonaws.com`)
- `YOUR_PASSWORD`: Your RDS master password

#### Step 2: Run Migration Script

**Option A: Using PowerShell Script (Recommended)**

```powershell
cd RealEstateAPI
.\migrate-to-rds.ps1
```

This script will:

- Validate your configuration
- Set environment to Production
- Run EF Core migrations
- Provide helpful error messages if something fails

**Option B: Manual Migration**

```powershell
cd RealEstateAPI
$env:ASPNETCORE_ENVIRONMENT="Production"
dotnet ef database update
$env:ASPNETCORE_ENVIRONMENT="Development"
```

#### Step 3: Verify Data

**Option A: Using Verification Script**

```powershell
.\verify-rds-data.ps1
```

This will guide you through verification steps.

**Option B: Manual Verification**

Connect to your RDS instance using SSMS or Azure Data Studio and run:

```sql
SELECT COUNT(*) as PropertyCount FROM Properties;
SELECT COUNT(*) as UserCount FROM Users;
SELECT COUNT(*) as RealtorCount FROM Realtors;

-- Should see:
-- PropertyCount: 10
-- UserCount: 10
-- RealtorCount: 10
```

**Deliverables:**

- ✅ Connection string updated in appsettings.Production.json
- ✅ Migrations run successfully against RDS
- ✅ Each table has 10+ rows of seed data
- ✅ Database connectivity tested from local machine

---

## Files Created for This Task

1. **appsettings.Production.json** - Production configuration with RDS connection string
2. **AWS_RDS_SETUP.md** - Detailed AWS RDS setup guide
3. **migrate-to-rds.ps1** - Automated migration script
4. **verify-rds-data.ps1** - Data verification helper
5. **TASK_9_INSTRUCTIONS.md** - This file

## Troubleshooting

### Problem: Cannot connect to RDS

**Solutions:**

1. Check RDS instance status is "Available"
2. Verify security group allows your IP on port 1433 (SQL Server) or 5432 (PostgreSQL)
3. Ensure "Public accessibility" is set to "Yes"
4. Check connection string format is correct
5. Try connecting with SSMS/Azure Data Studio first

### Problem: Migration fails with authentication error

**Solutions:**

1. Verify username is correct (default: admin)
2. Check password is correct (no special characters causing issues)
3. Ensure database name exists (RealEstateDB)
4. Try adding `;Encrypt=False` to connection string for testing

### Problem: Timeout errors

**Solutions:**

1. Check your internet connection
2. Verify RDS instance is in the same region you're accessing from
3. Increase connection timeout: Add `;Connection Timeout=60` to connection string
4. Check AWS service health status

### Problem: Migration runs but no data

**Solutions:**

1. Check that seed data migration was created (20251115231903_SeedData.cs)
2. Verify migration was applied: `dotnet ef migrations list`
3. Manually run seed data migration: `dotnet ef database update SeedData`

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit passwords to Git**
   - `appsettings.Production.json` should be in `.gitignore`
   - Use environment variables or AWS Secrets Manager in production

2. **Restrict Security Group Access**
   - Only allow your IP address
   - Never use 0.0.0.0/0 in production
   - Update security group when your IP changes

3. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Don't reuse passwords

4. **Enable SSL/TLS**
   - For production, download RDS CA certificate
   - Update connection string to require SSL

## Cost Management

💰 **AWS Free Tier:**

- 750 hours/month of db.t3.micro (enough for 1 instance running 24/7)
- 20 GB of storage
- 20 GB of backup storage

**To avoid charges:**

- Delete RDS instance when not in use
- Monitor usage in AWS Billing Dashboard
- Set up billing alerts

**To delete RDS instance:**

1. Go to RDS Console
2. Select your instance
3. Actions → Delete
4. Uncheck "Create final snapshot" (for testing)
5. Type "delete me" to confirm

## Testing Your RDS Connection

Before proceeding to Task 10, test your RDS connection:

```powershell
# Test connection using SSMS or Azure Data Studio
# Connection details:
# Server: [Your RDS Endpoint]
# Auth: SQL Server Authentication
# User: admin
# Password: [Your Password]
# Database: RealEstateDB

# Verify tables exist:
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

# Should see:
# - Properties
# - Users
# - Realtors
# - __EFMigrationsHistory

# Verify data:
SELECT 'Properties' as TableName, COUNT(*) as RowCount FROM Properties
UNION ALL
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'Realtors', COUNT(*) FROM Realtors;

# Should see 10 rows in each table
```

## Next Steps

After completing Task 9:

1. ✅ Mark Task 9.1 as complete in tasks.md
2. ✅ Mark Task 9.2 as complete in tasks.md
3. ✅ Mark Task 9 as complete in tasks.md
4. ➡️ Proceed to Task 10: Containerize API with Docker

## Questions?

If you encounter issues:

1. Check the troubleshooting section above
2. Review AWS_RDS_SETUP.md for detailed steps
3. Check AWS RDS documentation: <https://docs.aws.amazon.com/rds/>
4. Verify your AWS account has necessary permissions

## Summary

Task 9 sets up your cloud database infrastructure. Once complete, you'll have:

- A cloud-hosted database on AWS RDS
- Production-ready connection configuration
- Verified seed data for testing
- Foundation for deploying your API to AWS ECS

This is a critical milestone in your cloud deployment journey! 🚀
