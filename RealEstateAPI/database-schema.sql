IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Realtors] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [LicenseNumber] nvarchar(50) NOT NULL,
    [Agency] nvarchar(200) NOT NULL,
    [YearsOfExperience] int NOT NULL,
    [Specialization] nvarchar(100) NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Realtors] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [FirstName] nvarchar(100) NOT NULL,
    [LastName] nvarchar(100) NOT NULL,
    [Email] nvarchar(255) NOT NULL,
    [PhoneNumber] nvarchar(20) NOT NULL,
    [Address] nvarchar(200) NOT NULL,
    [CreatedDate] datetime2 NOT NULL,
    [IsActive] bit NOT NULL DEFAULT CAST(1 AS bit),
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Properties] (
    [Id] int NOT NULL IDENTITY,
    [Address] nvarchar(200) NOT NULL,
    [City] nvarchar(100) NOT NULL,
    [State] nvarchar(50) NOT NULL,
    [ZipCode] nvarchar(10) NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Bedrooms] int NOT NULL,
    [Bathrooms] int NOT NULL,
    [SquareFeet] int NOT NULL,
    [PropertyType] nvarchar(50) NOT NULL,
    [Status] nvarchar(50) NOT NULL,
    [RealtorId] int NULL,
    [ListedDate] datetime2 NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    CONSTRAINT [PK_Properties] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Properties_Realtors_RealtorId] FOREIGN KEY ([RealtorId]) REFERENCES [Realtors] ([Id]) ON DELETE SET NULL
);
GO

CREATE INDEX [IX_Properties_RealtorId] ON [Properties] ([RealtorId]);
GO

CREATE UNIQUE INDEX [IX_Realtors_Email] ON [Realtors] ([Email]);
GO

CREATE UNIQUE INDEX [IX_Realtors_LicenseNumber] ON [Realtors] ([LicenseNumber]);
GO

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251115231715_InitialCreate', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Agency', N'Email', N'FirstName', N'IsActive', N'LastName', N'LicenseNumber', N'PhoneNumber', N'Specialization', N'YearsOfExperience') AND [object_id] = OBJECT_ID(N'[Realtors]'))
    SET IDENTITY_INSERT [Realtors] ON;
INSERT INTO [Realtors] ([Id], [Agency], [Email], [FirstName], [IsActive], [LastName], [LicenseNumber], [PhoneNumber], [Specialization], [YearsOfExperience])
VALUES (1, N'Prime Realty Group', N'sarah.johnson@realty.com', N'Sarah', CAST(1 AS bit), N'Johnson', N'RE-2024-001', N'555-0101', N'Residential', 8),
(2, N'Luxury Estates Inc', N'michael.chen@realty.com', N'Michael', CAST(1 AS bit), N'Chen', N'RE-2024-002', N'555-0102', N'Luxury Homes', 12),
(3, N'Urban Living Realty', N'emily.rodriguez@realty.com', N'Emily', CAST(1 AS bit), N'Rodriguez', N'RE-2024-003', N'555-0103', N'Condos', 5),
(4, N'Coastal Properties', N'david.thompson@realty.com', N'David', CAST(1 AS bit), N'Thompson', N'RE-2024-004', N'555-0104', N'Waterfront', 15),
(5, N'Metro Realty Partners', N'jessica.martinez@realty.com', N'Jessica', CAST(1 AS bit), N'Martinez', N'RE-2024-005', N'555-0105', N'Commercial', 6),
(6, N'Family Home Realty', N'robert.anderson@realty.com', N'Robert', CAST(1 AS bit), N'Anderson', N'RE-2024-006', N'555-0106', N'Family Homes', 10),
(7, N'Downtown Realty', N'amanda.lee@realty.com', N'Amanda', CAST(1 AS bit), N'Lee', N'RE-2024-007', N'555-0107', N'Urban', 4),
(8, N'Suburban Living Realty', N'chris.wilson@realty.com', N'Christopher', CAST(1 AS bit), N'Wilson', N'RE-2024-008', N'555-0108', N'Suburban', 9),
(9, N'Investment Properties LLC', N'nicole.brown@realty.com', N'Nicole', CAST(1 AS bit), N'Brown', N'RE-2024-009', N'555-0109', N'Investment', 7),
(10, N'Green Valley Realty', N'james.taylor@realty.com', N'James', CAST(1 AS bit), N'Taylor', N'RE-2024-010', N'555-0110', N'Rural', 11);
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Agency', N'Email', N'FirstName', N'IsActive', N'LastName', N'LicenseNumber', N'PhoneNumber', N'Specialization', N'YearsOfExperience') AND [object_id] = OBJECT_ID(N'[Realtors]'))
    SET IDENTITY_INSERT [Realtors] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'CreatedDate', N'Email', N'FirstName', N'IsActive', N'LastName', N'PhoneNumber') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] ON;
INSERT INTO [Users] ([Id], [Address], [CreatedDate], [Email], [FirstName], [IsActive], [LastName], [PhoneNumber])
VALUES (1, N'123 Main St, Anytown, CA 90210', '2024-01-15T00:00:00.0000000', N'john.smith@email.com', N'John', CAST(1 AS bit), N'Smith', N'555-1001'),
(2, N'456 Oak Ave, Springfield, IL 62701', '2024-02-20T00:00:00.0000000', N'emma.davis@email.com', N'Emma', CAST(1 AS bit), N'Davis', N'555-1002'),
(3, N'789 Pine Rd, Portland, OR 97201', '2024-03-10T00:00:00.0000000', N'william.garcia@email.com', N'William', CAST(1 AS bit), N'Garcia', N'555-1003'),
(4, N'321 Elm St, Austin, TX 78701', '2024-04-05T00:00:00.0000000', N'olivia.miller@email.com', N'Olivia', CAST(1 AS bit), N'Miller', N'555-1004'),
(5, N'654 Maple Dr, Seattle, WA 98101', '2024-05-12T00:00:00.0000000', N'daniel.wilson@email.com', N'Daniel', CAST(1 AS bit), N'Wilson', N'555-1005'),
(6, N'987 Cedar Ln, Denver, CO 80201', '2024-06-18T00:00:00.0000000', N'sophia.moore@email.com', N'Sophia', CAST(1 AS bit), N'Moore', N'555-1006'),
(7, N'147 Birch Ct, Miami, FL 33101', '2024-07-22T00:00:00.0000000', N'matthew.taylor@email.com', N'Matthew', CAST(1 AS bit), N'Taylor', N'555-1007'),
(8, N'258 Spruce Way, Boston, MA 02101', '2024-08-08T00:00:00.0000000', N'isabella.anderson@email.com', N'Isabella', CAST(1 AS bit), N'Anderson', N'555-1008'),
(9, N'369 Willow Blvd, Phoenix, AZ 85001', '2024-09-14T00:00:00.0000000', N'ethan.thomas@email.com', N'Ethan', CAST(1 AS bit), N'Thomas', N'555-1009'),
(10, N'741 Ash Pl, Nashville, TN 37201', '2024-10-01T00:00:00.0000000', N'mia.jackson@email.com', N'Mia', CAST(1 AS bit), N'Jackson', N'555-1010');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'CreatedDate', N'Email', N'FirstName', N'IsActive', N'LastName', N'PhoneNumber') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] OFF;
GO

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'Bathrooms', N'Bedrooms', N'City', N'Description', N'ListedDate', N'Price', N'PropertyType', N'RealtorId', N'SquareFeet', N'State', N'Status', N'ZipCode') AND [object_id] = OBJECT_ID(N'[Properties]'))
    SET IDENTITY_INSERT [Properties] ON;
INSERT INTO [Properties] ([Id], [Address], [Bathrooms], [Bedrooms], [City], [Description], [ListedDate], [Price], [PropertyType], [RealtorId], [SquareFeet], [State], [Status], [ZipCode])
VALUES (1, N'1234 Sunset Blvd', 3, 4, N'Los Angeles', N'Beautiful modern home with stunning views', '2024-10-01T00:00:00.0000000', 850000.0, N'House', 1, 2500, N'CA', N'Available', N'90028'),
(2, N'567 Park Avenue', 2, 3, N'New York', N'Luxury condo in prime location', '2024-10-05T00:00:00.0000000', 1200000.0, N'Condo', 2, 1800, N'NY', N'Available', N'10022'),
(3, N'890 Lake Shore Drive', 2, 2, N'Chicago', N'Lakefront apartment with amazing amenities', '2024-09-15T00:00:00.0000000', 675000.0, N'Apartment', 3, 1500, N'IL', N'Pending', N'60611'),
(4, N'2345 Ocean View Road', 4, 5, N'Miami', N'Beachfront property with private access', '2024-10-10T00:00:00.0000000', 950000.0, N'House', 4, 3200, N'FL', N'Available', N'33139'),
(5, N'678 Mountain Trail', 3, 4, N'Denver', N'Mountain retreat with panoramic views', '2024-10-12T00:00:00.0000000', 725000.0, N'House', 5, 2800, N'CO', N'Available', N'80202'),
(6, N'901 Downtown Plaza', 2, 2, N'Seattle', N'Modern downtown condo near tech hub', '2024-08-20T00:00:00.0000000', 580000.0, N'Condo', 6, 1400, N'WA', N'Sold', N'98101'),
(7, N'3456 Suburban Lane', 2, 3, N'Austin', N'Family-friendly home in great school district', '2024-10-08T00:00:00.0000000', 495000.0, N'House', 7, 2000, N'TX', N'Available', N'78701'),
(8, N'789 Historic District', 3, 3, N'Boston', N'Charming historic townhouse fully renovated', '2024-10-03T00:00:00.0000000', 890000.0, N'Townhouse', 8, 2200, N'MA', N'Available', N'02101'),
(9, N'1122 Desert Vista', 2, 3, N'Phoenix', N'Desert oasis with pool and landscaping', '2024-10-14T00:00:00.0000000', 425000.0, N'House', 9, 1900, N'AZ', N'Available', N'85001'),
(10, N'4567 Music Row', 3, 4, N'Nashville', N'Contemporary home near entertainment district', '2024-09-28T00:00:00.0000000', 615000.0, N'House', 10, 2400, N'TN', N'Pending', N'37201');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'Id', N'Address', N'Bathrooms', N'Bedrooms', N'City', N'Description', N'ListedDate', N'Price', N'PropertyType', N'RealtorId', N'SquareFeet', N'State', N'Status', N'ZipCode') AND [object_id] = OBJECT_ID(N'[Properties]'))
    SET IDENTITY_INSERT [Properties] OFF;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251115231903_SeedData', N'8.0.11');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Properties] ADD [IsDeleted] bit NOT NULL DEFAULT CAST(0 AS bit);
GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 1;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 2;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 3;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 4;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 5;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 6;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 7;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 8;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 9;
SELECT @@ROWCOUNT;

GO

UPDATE [Properties] SET [IsDeleted] = CAST(0 AS bit)
WHERE [Id] = 10;
SELECT @@ROWCOUNT;

GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20251124015931_AddIsDeletedToProperty', N'8.0.11');
GO

COMMIT;
GO

