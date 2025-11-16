# AWS RDS Setup Guide

## Step 1: Create RDS Instance

### Option A: SQL Server Express (Recommended for .NET)

1. Go to AWS RDS Console: <https://console.aws.amazon.com/rds/>
2. Click **"Create database"**
3. **Engine options**:
   - Engine type: Microsoft SQL Server
   - Edition: SQL Server Express Edition
   - Version: Latest available
4. **Templates**: Free tier
5. **Settings**:
   - DB instance identifier: `realestate-db`
   - Master username: `admin`
   - Master password: [Create and save securely]
6. **Instance configuration**:
   - DB instance class: db.t3.micro
7. **Storage**:
   - Storage type: General Purpose SSD (gp2)
   - Allocated storage: 20 GB
   - Disable storage autoscaling (for cost control)
8. **Connectivity**:
   - Compute resource: Don't connect to an EC2 compute resource
   - VPC: Default VPC
   - Public access: **Yes**
   - VPC security group: Create new
   - Security group name: `realestate-db-sg`
   - Availability Zone: No preference
9. **Database authentication**: Password authentication
10. **Additional configuration**:
    - Initial database name: `RealEstateDB`
    - Backup retention: 1 day (minimum)
    - Disable Enhanced monitoring (to save costs)
11. Click **"Create database"**

### Option B: PostgreSQL (Alternative)

If you prefer PostgreSQL:
1. Follow same steps but choose:
   - Engine type: PostgreSQL
   - Version: PostgreSQL 15 or later
2. Connection string format will be different (see below)

## Step 2: Configure Security Group

After the RDS instance is created (takes 5-10 minutes):

1. Go to RDS Console → Databases
2. Click on your `realestate-db` instance
3. Under **Connectivity & security**, click on the VPC security group link
4. Click **"Edit inbound rules"**
5. Click **"Add rule"**:
   - Type: **MSSQL** (for SQL Server) or **PostgreSQL**
   - Port: 1433 (SQL Server) or 5432 (PostgreSQL)
   - Source: **My IP** (recommended) or **0.0.0.0/0** (for testing only)
6. Click **"Save rules"**

## Step 3: Get Connection Details

1. Go back to RDS Console → Databases → `realestate-db`
2. Under **Connectivity & security**, note:
   - **Endpoint**: (e.g., `realestate-db.xxxxxxxxx.us-east-1.rds.amazonaws.com`)
   - **Port**: 1433 (SQL Server) or 5432 (PostgreSQL)
3. You already have:
   - **Username**: admin (or what you chose)
   - **Password**: [what you set]
   - **Database name**: RealEstateDB

## Step 4: Update Connection String

### For SQL Server:

Edit `appsettings.Production.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_RDS_ENDPOINT;Database=RealEstateDB;User Id=admin;Password=YOUR_PASSWORD;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

Replace:
- `YOUR_RDS_ENDPOINT` with the endpoint from Step 3
- `YOUR_PASSWORD` with your master password

Example:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=realestate-db.abc123.us-east-1.rds.amazonaws.com;Database=RealEstateDB;User Id=admin;Password=MySecurePass123!;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

### For PostgreSQL:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=YOUR_RDS_ENDPOINT;Port=5432;Database=RealEstateDB;Username=admin;Password=YOUR_PASSWORD;SSL Mode=Require"
  }
}
```

## Step 5: Test Connection Locally

Before migrating, test the connection:

```bash
# Set environment to Production temporarily
$env:ASPNETCORE_ENVIRONMENT="Production"

# Try to connect (this will fail if connection is bad)
dotnet ef database update --project RealEstateAPI
```

## Step 6: Run Migrations

Once connection is confirmed:

```bash
# Make sure you're in the RealEstateAPI directory
cd RealEstateAPI

# Run migrations against RDS
dotnet ef database update --project RealEstateAPI

# Or if you're already in the project directory:
dotnet ef database update
```

## Step 7: Verify Data

You can verify the data using:

1. **SQL Server Management Studio (SSMS)** - for SQL Server
   - Server name: Your RDS endpoint
   - Authentication: SQL Server Authentication
   - Login: admin
   - Password: Your password

2. **Azure Data Studio** - works for both SQL Server and PostgreSQL
   - Download: https://aka.ms/azuredatastudio

3. **pgAdmin** - for PostgreSQL
   - Download: https://www.pgadmin.org/

Connect and verify:
- Tables exist: Properties, Users, Realtors
- Each table has 10+ rows of seed data

## Troubleshooting

### Cannot connect to RDS:
- Check security group allows your IP on correct port
- Verify RDS instance is "Available" status
- Check connection string is correct
- Ensure "Public accessibility" is set to "Yes"

### Migration fails:
- Verify database name exists (RealEstateDB)
- Check credentials are correct
- Ensure SQL Server version compatibility

### Timeout errors:
- Check VPC and subnet configuration
- Verify network connectivity
- Try increasing connection timeout in connection string

## Cost Considerations

- Free tier: 750 hours/month of db.t3.micro
- 20 GB storage included
- Remember to delete the instance when done to avoid charges
- Monitor usage in AWS Billing Dashboard

## Security Best Practices (For Production)

1. **Never commit passwords to Git**
   - Use AWS Secrets Manager
   - Use environment variables
   - Use User Secrets for local development

2. **Restrict Security Group**
   - Only allow specific IPs
   - Use VPC peering for ECS access
   - Never use 0.0.0.0/0 in production

3. **Enable SSL/TLS**
   - Download RDS CA certificate
   - Configure SSL in connection string

4. **Regular Backups**
   - Enable automated backups
   - Test restore procedures

## Next Steps

After completing this setup:
1. ✅ RDS instance created
2. ✅ Security group configured
3. ✅ Connection string updated
4. ✅ Migrations run successfully
5. ✅ Seed data verified (10+ rows per table)

You can now proceed to Task 10: Containerize API with Docker
