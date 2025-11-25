# Real Estate Client - UI Wireframes

## Page Layouts

### 1. Property List Page (Home)

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Properties                              [+ Add Property]    │
│                                                               │
│  [Search...] [Type ▼] [Status ▼] [Sort by ▼]               │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 🏠           │  │ 🏠           │  │ 🏠           │      │
│  │ 123 Main St  │  │ 456 Oak Ave  │  │ 789 Elm Rd   │      │
│  │ City, ST     │  │ City, ST     │  │ City, ST     │      │
│  │ $450,000     │  │ $325,000     │  │ $575,000     │      │
│  │ 3 bed 2 bath │  │ 2 bed 1 bath │  │ 4 bed 3 bath │      │
│  │ [Available]  │  │ [Pending]    │  │ [Available]  │      │
│  │              │  │              │  │              │      │
│  │ [View] [Edit]│  │ [View] [Edit]│  │ [View] [Edit]│      │
│  │ [Delete]     │  │ [Delete]     │  │ [Delete]     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ ...          │  │ ...          │  │ ...          │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 2. Property Detail Page

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [← Back to Properties]                                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Property Details                                    │    │
│  │                                                       │    │
│  │  🏠 [Large Property Image Placeholder]              │    │
│  │                                                       │    │
│  │  123 Main Street                                     │    │
│  │  Springfield, IL 62701                               │    │
│  │                                                       │    │
│  │  Price: $450,000                                     │    │
│  │  Status: [Available]                                 │    │
│  │                                                       │    │
│  │  Property Details:                                   │    │
│  │  • Type: Single Family Home                          │    │
│  │  • Bedrooms: 3                                       │    │
│  │  • Bathrooms: 2                                      │    │
│  │  • Square Feet: 2,100                                │    │
│  │  • Listed: January 15, 2024                          │    │
│  │  • Realtor: John Doe (#12345)                        │    │
│  │                                                       │    │
│  │  Description:                                        │    │
│  │  Beautiful home in quiet neighborhood...            │    │
│  │                                                       │    │
│  │  [Edit Property] [Quick Edit] [Delete Property]     │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```


### 3. Property Form (Create/Edit)

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [← Back to Properties]                                      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Create New Property                                 │    │
│  │                                                       │    │
│  │  Address *                                           │    │
│  │  [_____________________________________]             │    │
│  │                                                       │    │
│  │  City *              State *        Zip Code *       │    │
│  │  [______________]    [_______]      [________]       │    │
│  │                                                       │    │
│  │  Price *                                             │    │
│  │  $ [_____________________________________]           │    │
│  │                                                       │    │
│  │  Bedrooms *          Bathrooms *                     │    │
│  │  [_______]           [_________]                     │    │
│  │                                                       │    │
│  │  Square Feet *                                       │    │
│  │  [_____________________________________]             │    │
│  │                                                       │    │
│  │  Property Type *                                     │    │
│  │  [House ▼]                                           │    │
│  │                                                       │    │
│  │  Status *                                            │    │
│  │  [Available ▼]                                       │    │
│  │                                                       │    │
│  │  Realtor ID (optional)                               │    │
│  │  [_____________________________________]             │    │
│  │                                                       │    │
│  │  Listed Date *                                       │    │
│  │  [📅 MM/DD/YYYY]                                     │    │
│  │                                                       │    │
│  │  Description                                         │    │
│  │  [_____________________________________]             │    │
│  │  [_____________________________________]             │    │
│  │  [_____________________________________]             │    │
│  │                                                       │    │
│  │  * Required fields                                   │    │
│  │                                                       │    │
│  │  [Cancel]                    [Save Property]         │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 4. Property Patch Form (Partial Update)

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [← Back to Property]                                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  Quick Edit Property - 123 Main Street              │    │
│  │                                                       │    │
│  │  Select field to update:                             │    │
│  │  [Price ▼]                                           │    │
│  │                                                       │    │
│  │  New Price:                                          │    │
│  │  $ [450000]                                          │    │
│  │                                                       │    │
│  │  [+ Add Another Field]                               │    │
│  │                                                       │    │
│  │  ─────────────────────────────────────               │    │
│  │                                                       │    │
│  │  Pending Changes:                                    │    │
│  │  • Price: $450,000 → $475,000  [Remove]             │    │
│  │                                                       │    │
│  │  ─────────────────────────────────────               │    │
│  │                                                       │    │
│  │  [Cancel]              [Apply Changes]               │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```


### 5. User List Page

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Users                                      [+ Add User]     │
│                                                               │
│  [Search...]                                                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 👤 John Smith                                        │    │
│  │    john.smith@email.com                              │    │
│  │    📞 (555) 123-4567                                 │    │
│  │    Registered: Jan 15, 2024                          │    │
│  │    Status: [Active]                                  │    │
│  │                                                       │    │
│  │    [View Details] [Edit] [Delete]                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 👤 Jane Doe                                          │    │
│  │    jane.doe@email.com                                │    │
│  │    📞 (555) 987-6543                                 │    │
│  │    Registered: Feb 20, 2024                          │    │
│  │    Status: [Active]                                  │    │
│  │                                                       │    │
│  │    [View Details] [Edit] [Delete]                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 👤 Bob Johnson                                       │    │
│  │    bob.j@email.com                                   │    │
│  │    📞 (555) 456-7890                                 │    │
│  │    Registered: Mar 10, 2024                          │    │
│  │    Status: [Inactive]                                │    │
│  │                                                       │    │
│  │    [View Details] [Edit] [Delete]                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 6. Realtor List Page

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Realtors                                [+ Add Realtor]     │
│                                                               │
│  [Search...] [Specialization ▼]                             │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 👔           │  │ 👔           │  │ 👔           │      │
│  │ Sarah Miller │  │ Mike Davis   │  │ Lisa Brown   │      │
│  │ License:     │  │ License:     │  │ License:     │      │
│  │ #RE123456    │  │ #RE789012    │  │ #RE345678    │      │
│  │              │  │              │  │              │      │
│  │ Experience:  │  │ Experience:  │  │ Experience:  │      │
│  │ 8 years      │  │ 5 years      │  │ 12 years     │      │
│  │              │  │              │  │              │      │
│  │ Residential  │  │ Commercial   │  │ Luxury       │      │
│  │              │  │              │  │              │      │
│  │ [Active]     │  │ [Active]     │  │ [Active]     │      │
│  │              │  │              │  │              │      │
│  │ [View] [Edit]│  │ [View] [Edit]│  │ [View] [Edit]│      │
│  │ [Delete]     │  │ [Delete]     │  │ [Delete]     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```


### 7. Delete Confirmation Dialog

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│     ┌───────────────────────────────────────────┐           │
│     │  ⚠️  Confirm Delete                       │           │
│     │                                            │           │
│     │  Are you sure you want to delete this     │           │
│     │  property?                                 │           │
│     │                                            │           │
│     │  123 Main Street, Springfield, IL          │           │
│     │                                            │           │
│     │  This action cannot be undone.            │           │
│     │                                            │           │
│     │  [Cancel]              [Delete Property]  │           │
│     │                                            │           │
│     └───────────────────────────────────────────┘           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 8. Loading State

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                                                               │
│                                                               │
│                         ⏳                                    │
│                   Loading properties...                      │
│                                                               │
│                                                               │
│                                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 9. Error State

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ❌ Error Loading Properties                        │    │
│  │                                                       │    │
│  │  Failed to fetch properties from the server.        │    │
│  │  Please check your connection and try again.        │    │
│  │                                                       │    │
│  │  [Retry]                                             │    │
│  │                                                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 10. Empty State

```
┌─────────────────────────────────────────────────────────────┐
│  Real Estate App                                    [User]   │
├─────────────────────────────────────────────────────────────┤
│  [Properties] [Users] [Realtors]                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Properties                              [+ Add Property]    │
│                                                               │
│                                                               │
│                         🏠                                    │
│                  No properties found                         │
│                                                               │
│         Get started by adding your first property!           │
│                                                               │
│                   [Add Property]                             │
│                                                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```


## Mobile Responsive Views (Optional)

### Mobile Property List

```
┌──────────────────────┐
│ Real Estate App  ☰   │
├──────────────────────┤
│                      │
│ Properties           │
│                      │
│ [+ Add]              │
│                      │
│ [Search...]          │
│                      │
│ ┌──────────────────┐ │
│ │ 🏠               │ │
│ │ 123 Main St      │ │
│ │ City, ST         │ │
│ │ $450,000         │ │
│ │ 3 bed 2 bath     │ │
│ │ [Available]      │ │
│ │                  │ │
│ │ [View] [Edit]    │ │
│ │ [Delete]         │ │
│ └──────────────────┘ │
│                      │
│ ┌──────────────────┐ │
│ │ 🏠               │ │
│ │ 456 Oak Ave      │ │
│ │ City, ST         │ │
│ │ $325,000         │ │
│ │ 2 bed 1 bath     │ │
│ │ [Pending]        │ │
│ │                  │ │
│ │ [View] [Edit]    │ │
│ │ [Delete]         │ │
│ └──────────────────┘ │
│                      │
└──────────────────────┘
```

## Component Interaction Flow

### Create Property Flow

```
PropertyList
    │
    ├─ Click [+ Add Property]
    │
    ▼
PropertyForm (mode: create)
    │
    ├─ Fill form fields
    ├─ Click [Save Property]
    │
    ▼
API Call: POST /api/properties
    │
    ├─ Success
    │   ├─ Show success message
    │   └─ Navigate to PropertyList
    │
    └─ Error
        ├─ Show error message
        └─ Stay on form
```

### Edit Property Flow (PUT)

```
PropertyList or PropertyDetail
    │
    ├─ Click [Edit]
    │
    ▼
PropertyForm (mode: edit)
    │
    ├─ Load existing data
    ├─ Modify fields
    ├─ Click [Save Property]
    │
    ▼
API Call: PUT /api/properties/{id}
    │
    ├─ Success
    │   ├─ Show success message
    │   └─ Navigate to PropertyDetail
    │
    └─ Error
        ├─ Show error message
        └─ Stay on form
```

### Quick Edit Flow (PATCH)

```
PropertyDetail
    │
    ├─ Click [Quick Edit]
    │
    ▼
PropertyPatchForm
    │
    ├─ Select field(s) to update
    ├─ Enter new value(s)
    ├─ Click [Apply Changes]
    │
    ▼
API Call: PATCH /api/properties/{id}
    │
    ├─ Success
    │   ├─ Show success message
    │   └─ Navigate to PropertyDetail
    │
    └─ Error
        ├─ Show error message
        └─ Stay on form
```

### Delete Property Flow

```
PropertyList or PropertyDetail
    │
    ├─ Click [Delete]
    │
    ▼
ConfirmDialog
    │
    ├─ Click [Cancel]
    │   └─ Close dialog
    │
    └─ Click [Delete Property]
        │
        ▼
    API Call: DELETE /api/properties/{id}
        │
        ├─ Success
        │   ├─ Show success message
        │   ├─ Remove from list
        │   └─ Navigate to PropertyList
        │
        └─ Error
            ├─ Show error message
            └─ Stay on current page
```

## Color Coding Legend

- 🟦 Blue: Primary actions (View, Save, Create)
- 🟩 Green: Success states and confirmations
- 🟧 Orange: Edit and update actions
- 🟥 Red: Delete and destructive actions
- ⚪ Gray: Cancel and secondary actions
- 🟨 Yellow: Warning states

## Notes for Implementation

1. **Consistency**: Use the same layout pattern for all three entities (Properties, Users, Realtors)
2. **Accessibility**: Ensure all interactive elements are keyboard accessible
3. **Feedback**: Always provide visual feedback for user actions
4. **Validation**: Show validation errors inline, near the relevant field
5. **Loading**: Show loading states for all async operations
6. **Errors**: Display errors prominently with actionable solutions
7. **Confirmation**: Always confirm destructive actions (delete)
8. **Navigation**: Provide clear breadcrumbs and back buttons
9. **Responsive**: Ensure layouts work on different screen sizes
10. **Icons**: Use consistent icons throughout the application

