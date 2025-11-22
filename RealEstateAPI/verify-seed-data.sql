-- SQL Script to Verify RDS Seed Data
-- Run this in SSMS or Azure Data Studio after migration

-- ========================================
-- 1. Check Table Row Counts
-- ========================================
PRINT '========================================';
PRINT 'TABLE ROW COUNTS';
PRINT '========================================';
PRINT '';

SELECT 
    'Properties' as TableName, 
    COUNT(*) as RowCount,
    CASE 
        WHEN COUNT(*) >= 10 THEN '✓ PASS'
        ELSE '✗ FAIL - Need 10+ rows'
    END as Status
FROM Properties
UNION ALL
SELECT 
    'Users', 
    COUNT(*),
    CASE 
        WHEN COUNT(*) >= 10 THEN '✓ PASS'
        ELSE '✗ FAIL - Need 10+ rows'
    END
FROM Users
UNION ALL
SELECT 
    'Realtors', 
    COUNT(*),
    CASE 
        WHEN COUNT(*) >= 10 THEN '✓ PASS'
        ELSE '✗ FAIL - Need 10+ rows'
    END
FROM Realtors;

PRINT '';
PRINT '========================================';
PRINT 'SAMPLE DATA FROM EACH TABLE';
PRINT '========================================';
PRINT '';

-- ========================================
-- 2. Sample Realtors Data
-- ========================================
PRINT 'REALTORS (First 5):';
SELECT TOP 5
    Id,
    FirstName + ' ' + LastName as Name,
    Email,
    Agency,
    Specialization,
    YearsOfExperience
FROM Realtors
ORDER BY Id;

PRINT '';

-- ========================================
-- 3. Sample Users Data
-- ========================================
PRINT 'USERS (First 5):';
SELECT TOP 5
    Id,
    FirstName + ' ' + LastName as Name,
    Email,
    PhoneNumber,
    IsActive
FROM Users
ORDER BY Id;

PRINT '';

-- ========================================
-- 4. Sample Properties Data
-- ========================================
PRINT 'PROPERTIES (First 5):';
SELECT TOP 5
    p.Id,
    p.Address,
    p.City,
    p.State,
    p.Price,
    p.PropertyType,
    p.Status,
    r.FirstName + ' ' + r.LastName as RealtorName
FROM Properties p
LEFT JOIN Realtors r ON p.RealtorId = r.Id
ORDER BY p.Id;

PRINT '';

-- ========================================
-- 5. Verify Relationships
-- ========================================
PRINT '========================================';
PRINT 'RELATIONSHIP VERIFICATION';
PRINT '========================================';
PRINT '';

PRINT 'Properties with Realtors:';
SELECT 
    COUNT(*) as PropertiesWithRealtors,
    CASE 
        WHEN COUNT(*) > 0 THEN '✓ Relationships working'
        ELSE '✗ No relationships found'
    END as Status
FROM Properties p
INNER JOIN Realtors r ON p.RealtorId = r.Id;

PRINT '';

-- ========================================
-- 6. Data Quality Checks
-- ========================================
PRINT '========================================';
PRINT 'DATA QUALITY CHECKS';
PRINT '========================================';
PRINT '';

-- Check for unique emails in Users
PRINT 'Unique User Emails:';
SELECT 
    COUNT(DISTINCT Email) as UniqueEmails,
    COUNT(*) as TotalUsers,
    CASE 
        WHEN COUNT(DISTINCT Email) = COUNT(*) THEN '✓ All emails unique'
        ELSE '✗ Duplicate emails found'
    END as Status
FROM Users;

PRINT '';

-- Check for unique emails in Realtors
PRINT 'Unique Realtor Emails:';
SELECT 
    COUNT(DISTINCT Email) as UniqueEmails,
    COUNT(*) as TotalRealtors,
    CASE 
        WHEN COUNT(DISTINCT Email) = COUNT(*) THEN '✓ All emails unique'
        ELSE '✗ Duplicate emails found'
    END as Status
FROM Realtors;

PRINT '';

-- Check for unique license numbers
PRINT 'Unique License Numbers:';
SELECT 
    COUNT(DISTINCT LicenseNumber) as UniqueLicenses,
    COUNT(*) as TotalRealtors,
    CASE 
        WHEN COUNT(DISTINCT LicenseNumber) = COUNT(*) THEN '✓ All licenses unique'
        ELSE '✗ Duplicate licenses found'
    END as Status
FROM Realtors;

PRINT '';

-- ========================================
-- 7. Summary Statistics
-- ========================================
PRINT '========================================';
PRINT 'SUMMARY STATISTICS';
PRINT '========================================';
PRINT '';

PRINT 'Property Statistics:';
SELECT 
    MIN(Price) as MinPrice,
    MAX(Price) as MaxPrice,
    AVG(Price) as AvgPrice,
    COUNT(DISTINCT PropertyType) as PropertyTypes,
    COUNT(DISTINCT Status) as StatusTypes
FROM Properties;

PRINT '';

PRINT 'Property Status Distribution:';
SELECT 
    Status,
    COUNT(*) as Count
FROM Properties
GROUP BY Status
ORDER BY Count DESC;

PRINT '';

PRINT 'Property Types Distribution:';
SELECT 
    PropertyType,
    COUNT(*) as Count
FROM Properties
GROUP BY PropertyType
ORDER BY Count DESC;

PRINT '';

-- ========================================
-- 8. Final Verification Summary
-- ========================================
PRINT '========================================';
PRINT 'FINAL VERIFICATION SUMMARY';
PRINT '========================================';
PRINT '';

DECLARE @PropertiesCount INT, @UsersCount INT, @RealtorsCount INT;
DECLARE @AllPassed BIT = 1;

SELECT @PropertiesCount = COUNT(*) FROM Properties;
SELECT @UsersCount = COUNT(*) FROM Users;
SELECT @RealtorsCount = COUNT(*) FROM Realtors;

IF @PropertiesCount < 10 SET @AllPassed = 0;
IF @UsersCount < 10 SET @AllPassed = 0;
IF @RealtorsCount < 10 SET @AllPassed = 0;

SELECT 
    @PropertiesCount as PropertiesCount,
    @UsersCount as UsersCount,
    @RealtorsCount as RealtorsCount,
    @PropertiesCount + @UsersCount + @RealtorsCount as TotalRows,
    CASE 
        WHEN @AllPassed = 1 THEN '✓✓✓ ALL CHECKS PASSED - Task Complete!'
        ELSE '✗ FAILED - Some tables have less than 10 rows'
    END as FinalStatus;

PRINT '';
PRINT '========================================';
IF @AllPassed = 1
BEGIN
    PRINT '✓ SUCCESS! Database seeding complete.';
    PRINT 'All tables have 10+ rows as required.';
    PRINT 'You can mark Task 2.4 as complete!';
END
ELSE
BEGIN
    PRINT '✗ INCOMPLETE - Please check the counts above.';
    PRINT 'Each table needs at least 10 rows.';
END
PRINT '========================================';
