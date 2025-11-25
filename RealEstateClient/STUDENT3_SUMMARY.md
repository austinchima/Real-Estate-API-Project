# Student 3 Frontend Task - Executive Summary

## Overview

You are responsible for building the React web client that consumes the Real Estate API through APigee gateway. This is worth **21 marks** out of the total project grade.

## Your Deliverables

### 1. Complete React Application (19 marks)

**API Integration (1 mark):**

- ✅ Axios client configured with APigee API key
- ✅ Proper headers and authentication

**All 6 HTTP Methods × 3 Entities (18 marks):**

**Properties (6 marks):**

- GET all → PropertyList component
- GET by ID → PropertyDetail component  
- POST → PropertyForm (create mode)
- PUT → PropertyForm (edit mode)
- PATCH → PropertyPatchForm component
- DELETE → Delete button with confirmation

**Users (6 marks):**

- Same 6 operations as Properties
- UserList, UserDetail, UserForm, UserPatchForm

**Realtors (6 marks):**

- Same 6 operations as Properties
- RealtorList, RealtorDetail, RealtorForm, RealtorPatchForm

### 2. Code Quality (2 marks)

- Clean component structure
- TypeScript for type safety
- Reusable common components
- Good error handling
- User-friendly interface

### 3. APigee Configuration (7 marks - Already Done ✅)

- API proxy created
- API key verification working
- Developer portal generated
- 2 developers registered

### 4. Documentation & Presentation

- Architecture diagram
- Setup instructions
- Demo preparation

---

## Current Status

### ✅ Already Completed

- Basic React app structure
- Axios client with APigee support
- React Router setup
- Service layer structure
- Basic list components
- Basic form components (create only)
- DELETE functionality

### ❌ Still Needed

- TypeScript types definition
- GET by ID (detail views)
- PUT (full update in forms)
- PATCH (partial update components)
- Edit functionality
- Better error handling
- Form validation
- Confirmation dialogs
- Improved UI/UX
- S3 deployment

---

## Implementation Timeline

### Week 8, Day 1-2 (6 hours)

- Define TypeScript types
- Create common components
- Update API layer with PATCH

### Week 8, Day 3-4 (8 hours)

- Complete Properties module
- All 6 HTTP methods working
- Test thoroughly

### Week 8, Day 5-6 (8 hours)

- Complete Users module
- Complete Realtors module
- Test all endpoints

### Week 9, Day 1-2 (6 hours)

- Polish UI/UX
- Add loading states
- Improve error handling
- Add validation

### Week 9, Day 3-4 (4 hours)

- End-to-end testing
- Fix bugs
- Browser testing

### Week 9, Day 5 (3 hours)

- Build for production
- Deploy to S3
- Final testing

---

## Key Files to Create/Modify

### Types (New)

- `src/types/property.ts`
- `src/types/user.ts`
- `src/types/realtor.ts`
- `src/types/common.ts`

### Common Components (New)

- `src/components/common/Button.tsx`
- `src/components/common/Modal.tsx`
- `src/components/common/LoadingSpinner.tsx`
- `src/components/common/ErrorMessage.tsx`
- `src/components/common/ConfirmDialog.tsx`

### Property Components (Modify/Create)

- `src/components/properties/PropertyList.tsx` (enhance)
- `src/components/properties/PropertyDetail.tsx` (create)
- `src/components/properties/PropertyForm.tsx` (enhance for PUT)
- `src/components/properties/PropertyPatchForm.tsx` (create)

### User Components (Create)

- `src/components/users/UserDetail.tsx`
- `src/components/users/UserForm.tsx` (enhance)
- `src/components/users/UserPatchForm.tsx`

### Realtor Components (Create)

- `src/components/realtors/RealtorDetail.tsx`
- `src/components/realtors/RealtorForm.tsx` (enhance)
- `src/components/realtors/RealtorPatchForm.tsx`

### API Layer (Modify)

- `src/api/properties.ts` (add PATCH)
- `src/api/users.ts` (add PATCH)
- `src/api/realtors.ts` (add PATCH)

### Routing (Modify)

- `src/App.tsx` (add all routes)

---

## Critical Success Factors

### 1. All 18 Endpoints Must Work

This is the most important requirement. Each of the 6 HTTP methods must work for all 3 entities:

```
Properties: GET all, GET by ID, POST, PUT, PATCH, DELETE ✓
Users:      GET all, GET by ID, POST, PUT, PATCH, DELETE ✓
Realtors:   GET all, GET by ID, POST, PUT, PATCH, DELETE ✓
```

### 2. PATCH Implementation

PATCH is often overlooked but worth 3 marks per entity (9 marks total). Use JSON Patch format:

```json
[
  { "op": "replace", "path": "/price", "value": 450000 },
  { "op": "replace", "path": "/status", "value": "Sold" }
]
```

### 3. API Key Authentication

Must be properly configured in axios client:

```typescript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_API_KEY
}
```

### 4. User Experience

- Loading states during API calls
- Error messages when things fail
- Confirmation before delete
- Form validation
- Clear navigation

---

## Testing Strategy

### For Each Entity, Test

1. **List View**: Navigate to list, verify data loads
2. **Detail View**: Click item, verify all fields display
3. **Create**: Fill form, submit, verify in list
4. **Edit (PUT)**: Modify all fields, save, verify changes
5. **Quick Edit (PATCH)**: Update one field, verify only that field changed
6. **Delete**: Click delete, confirm, verify removed

### Test Scenarios

- ✅ Happy path (everything works)
- ✅ Empty state (no data)
- ✅ Loading state (slow network)
- ✅ Error state (API down)
- ✅ Validation errors (invalid data)
- ✅ Network errors (no connection)

---

## Common Pitfalls to Avoid

1. **Forgetting PATCH**: Don't skip PATCH implementation (9 marks!)
2. **Wrong Content-Type for PATCH**: Use `application/json-patch+json`
3. **No Error Handling**: Always wrap API calls in try-catch
4. **No Loading States**: Users need feedback during operations
5. **No Validation**: Validate forms before submission
6. **Hardcoded API Key**: Use environment variables
7. **Not Testing All Methods**: Test all 18 endpoints thoroughly
8. **Poor UI**: Make it look professional, not rushed
9. **Missing Confirmation**: Always confirm destructive actions
10. **Deployment Issues**: Test S3 deployment early

---

## Resources

### Documentation Files

1. **FRONTEND_DESIGN.md** - Complete design specification
2. **WIREFRAMES.md** - UI mockups and layouts
3. **IMPLEMENTATION_GUIDE.md** - Code examples and step-by-step guide
4. **This file** - Quick reference summary

### External Resources

- React Docs: <https://react.dev>
- React Router: <https://reactrouter.com>
- Axios: <https://axios-http.com>
- TypeScript: <https://www.typescriptlang.org>
- Vite: <https://vitejs.dev>

### Team Resources

- Backend API: Student 2's deployed ECS endpoint
- API Documentation: Swagger UI from Student 2
- Database Schema: Student 1's ER diagram
- APigee Portal: Your developer portal

---

## Quick Reference Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run lint         # Check code quality

# Production
npm run build        # Build for production (creates dist/)
npm run preview      # Preview production build

# Deployment
aws s3 sync dist/ s3://your-bucket-name/ --delete
```

---

## Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=https://your-apigee-url.com/api
VITE_API_KEY=your-api-key-here
```

**Never commit `.env` to Git!** Use `.env.example` as template.

---

## Presentation Tips

### Demo Flow (10 minutes total)

1. **Introduction (1 min)**: Architecture overview
2. **Properties Demo (3 min)**: Show all 6 operations
3. **Users Demo (2 min)**: Show all 6 operations
4. **Realtors Demo (2 min)**: Show all 6 operations
5. **Technical Highlights (2 min)**: API key, error handling, validation

### Be Ready to Answer

- How does API key authentication work?
- What's the difference between PUT and PATCH?
- How do you handle errors?
- Why React and TypeScript?
- How is the app deployed?

---

## Success Checklist

Before submission, verify:

- [ ] All 18 endpoints working
- [ ] API key configured
- [ ] Forms have validation
- [ ] Loading states everywhere
- [ ] Error handling everywhere
- [ ] Delete confirmations
- [ ] Responsive design
- [ ] No console errors
- [ ] Deployed to S3
- [ ] Tested on Chrome, Firefox, Edge
- [ ] Code is clean
- [ ] README updated
- [ ] Architecture diagram ready
- [ ] Presentation practiced

---

## Getting Help

1. **Check Documentation**: Read the design docs first
2. **Test API Directly**: Use Postman to verify endpoints work
3. **Console Logging**: Use console.log to debug
4. **Ask Student 2**: For API endpoint issues
5. **Ask Student 1**: For data structure questions
6. **Google/Stack Overflow**: For React/TypeScript questions
7. **Office Hours**: Ask professor if really stuck

---

## Final Words

You have a solid foundation already in place. The main work is:

1. **Adding the missing HTTP methods** (GET by ID, PUT, PATCH)
2. **Creating detail and patch components**
3. **Improving UX** (loading, errors, validation)
4. **Testing thoroughly**
5. **Deploying to S3**

Follow the implementation guide, test as you go, and you'll have a professional application that demonstrates all required functionality.

**Estimated Total Time: 35-40 hours**

Good luck! 🚀
