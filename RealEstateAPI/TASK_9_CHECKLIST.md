# Task 9 Execution Checklist

Use this checklist to track your progress through Task 9.

## Pre-Flight Check

- [ ] I have an AWS account
- [ ] I have completed Tasks 1-3 (database models and migrations exist)
- [ ] I have SQL Server Management Studio or Azure Data Studio installed
- [ ] I have reviewed [TASK_9_QUICK_START.md](TASK_9_QUICK_START.md)

## Task 9.1: Create AWS RDS Instance

### AWS Console Steps

- [ ] Logged into AWS Console
- [ ] Navigated to RDS service
- [ ] Clicked "Create database"
- [ ] Selected SQL Server Express (or PostgreSQL)
- [ ] Selected "Free tier" template
- [ ] Set DB identifier: `realestate-db`
- [ ] Set Master username: `admin`
- [ ] Created and saved strong password
- [ ] Selected db.t3.micro instance
- [ ] Set storage to 20 GB
- [ ] Set Public access to "Yes"
- [ ] Set Initial database name: `RealEstateDB`
- [ ] Clicked "Create database"
- [ ] Waited for instance status to become "Available" (5-10 minutes)

### Security Group Configuration

- [ ] Clicked on RDS instance
- [ ] Clicked on VPC security group link
- [ ] Clicked "Edit inbound rules"
- [ ] Added rule for MSSQL (1433) or PostgreSQL (5432)
- [ ] Set Source to "My IP"
- [ ] Saved rules

### Save Connection Details

- [ ] Copied RDS Endpoint from "Connectivity & security" tab
- [ ] Noted Port number (1433 or 5432)
- [ ] Saved Master username
- [ ] Saved Master password (securely!)
- [ ] Noted Database name (RealEstateDB)

### Mark Complete

- [ ] Task 9.1 ready to mark as complete in tasks.md

---

## Task 9.2: Migrate Database to AWS RDS

### Update Configuration

- [ ] Opened `appsettings.Production.json`
- [ ] Replaced `YOUR_RDS_ENDPOINT` with actual endpoint
- [ ] Replaced `YOUR_PASSWORD` with actual password
- [ ] Verified connection string format is correct
- [ ] Saved file

### Run Migration

- [ ] Opened PowerShell
- [ ] Navigated to RealEstateAPI directory: `cd RealEstateAPI`
- [ ] Ran migration script: `.\migrate-to-rds.ps1`
- [ ] Migration completed successfully (no errors)

### Verify Data

- [ ] Opened SSMS or Azure Data Studio
- [ ] Connected to RDS instance using:
  - Server: [RDS Endpoint]
  - Auth: SQL Server Authentication
  - User: admin
  - Password: [Your Password]
  - Database: RealEstateDB
- [ ] Connection successful
- [ ] Ran query: `SELECT COUNT(*) FROM Properties;`
- [ ] Result: 10 rows ✓
- [ ] Ran query: `SELECT COUNT(*) FROM Users;`
- [ ] Result: 10 rows ✓
- [ ] Ran query: `SELECT COUNT(*) FROM Realtors;`
- [ ] Result: 10 rows ✓

### Additional Verification

- [ ] Verified tables exist: Properties, Users, Realtors
- [ ] Checked sample data looks correct
- [ ] Tested connection from local machine
- [ ] No errors in AWS RDS logs

### Mark Complete

- [ ] Task 9.2 ready to mark as complete in tasks.md

---

## Final Verification

### All Success Criteria Met

- [ ] RDS instance status: "Available"
- [ ] Security group allows my IP
- [ ] Connection string updated correctly
- [ ] Migrations ran without errors
- [ ] Properties table has 10 rows
- [ ] Users table has 10 rows
- [ ] Realtors table has 10 rows
- [ ] Can connect from local machine
- [ ] All data looks correct

### Documentation

- [ ] Saved RDS endpoint in secure location
- [ ] Saved credentials securely (not in Git!)
- [ ] Documented any issues encountered
- [ ] Noted RDS instance details for future reference

### Mark Complete

- [ ] Task 9 ready to mark as complete in tasks.md
- [ ] Ready to proceed to Task 10: Containerize API

---

## Troubleshooting Reference

If you encounter issues, check:

1. **Cannot connect to RDS**
   - [ ] RDS status is "Available"
   - [ ] Security group allows my IP on correct port
   - [ ] Public accessibility is "Yes"
   - [ ] Connection string is correct

2. **Migration fails**
   - [ ] Connection string format is correct
   - [ ] Credentials are correct
   - [ ] Database name exists (RealEstateDB)
   - [ ] Network connectivity is working

3. **No data after migration**
   - [ ] Seed data migration exists (20251115231903_SeedData.cs)
   - [ ] Migration was applied successfully
   - [ ] Check __EFMigrationsHistory table

For detailed troubleshooting, see [TASK_9_INSTRUCTIONS.md](TASK_9_INSTRUCTIONS.md)

[Back to Tasks](./tasks.md)

---

## Time Tracking

- Task 9.1 estimated time: 15-20 minutes
- Task 9.2 estimated time: 5-10 minutes
- Total estimated time: 20-30 minutes

Actual time taken:

- Task 9.1: _____ minutes
- Task 9.2: _____ minutes
- Total: _____ minutes

---

## Notes

Use this space to note any issues, solutions, or important information:

```plaintext
[Your notes here]
```

---

## Next Steps

After completing this checklist:

1. Mark tasks complete in `.kiro/specs/real-estate-api/tasks.md`
2. Proceed to Task 10: Containerize API with Docker
3. Keep RDS instance running (needed for Task 11)

---

## Cost Reminder

💰 Your RDS instance is now running and consuming Free Tier hours

- Free Tier: 750 hours/month
- Monitor usage in AWS Billing Dashboard
- Delete instance when done to avoid charges

To delete: RDS Console → Select instance → Actions → Delete
