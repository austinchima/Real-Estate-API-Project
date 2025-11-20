# Team Task Assignments

## Project Overview

This document assigns tasks from the implementation plan to each of the 3 team members. The work is distributed to balance the workload (~20 marks each from the marking scheme) while maintaining clear ownership and requiring collaboration at integration points.

---

## Student 1: Backend Core & Data Layer

**Focus:** Database, Repository Pattern, DTOs, and Data Models

### Assigned Tasks

**Primary Responsibilities:**

- [x] Task 1: Set up project structure and core infrastructure

- [x] Task 2: Implement data models and database configuration

  - [x] 2.1 Create entity models for Property, User, and Realtor
  - [x] 2.2 Configure Entity Framework DbContext and relationships
  - [x] 2.3 Create and apply initial database migration
  - [x] 2.4 Seed database with sample data
- [x] Task 3: Implement DTOs and AutoMapper configuration


  - [x] 3.1 Create DTO classes for all entities
  - [x] 3.2 Configure AutoMapper profiles

- [x] Task 4: Implement Repository Pattern for data access

  - [x] 4.1 Create repository interfaces
  - [x] 4.2 Implement repository classes
- [ ] Task 9: Configure and deploy database to AWS RDS
  - [ ] 9.1 Create AWS RDS instance
  - [ ] 9.2 Migrate database to AWS RDS

**Marking Scheme Coverage (~15 marks):**

- 2.1 Data in cloud RDS (3 marks)
- 2.2 Repository pattern (2 marks)
- 2.3 DTO classes & AutoMapper (5.5 marks)
- Contribution to 2.15 Overall quality (1.5 marks)
- 3.3 Data modeling document (2 marks)

**Deliverables:**

- Complete entity models (Property, User, Realtor)
- Working repository layer with interfaces and implementations
- 9+ DTO classes (3 per entity)
- AutoMapper profiles configured
- AWS RDS database with 10+ rows per table
- ER diagram for documentation

**Integration Points:**

- Provide repository interfaces to Student 2 for service layer
- Provide DTO contracts to Student 2 for controllers
- Share database connection string with Student 2 for deployment

---

## Student 2: Backend API & Cloud Deployment

**Focus:** Controllers, Services, HTTP Methods, Docker, and AWS ECS

### Assigned Tasks

**Primary Responsibilities:**

- [ ] Task 5: Implement Service Layer with business logic
  - [ ] 5.1 Create service interfaces
  - [ ] 5.2 Implement PropertyService
  - [ ] 5.3 Implement UserService
  - [ ] 5.4 Implement RealtorService
- [x] Task 6: Implement API Controllers with all HTTP methods
  - [x] 6.1 Implement PropertiesController
  - [x] 6.2 Implement UsersController
  - [x] 6.3 Implement RealtorsController
- [ ] Task 7: Implement global error handling and validation
- [ ] Task 8: Configure Swagger/OpenAPI documentation
- [ ] Task 10: Containerize API with Docker
- [ ] Task 11: Deploy API to AWS ECS using Fargate
  - [ ] 11.1 Push Docker image to AWS ECR
  - [ ] 11.2 Create and configure ECS task definition
  - [ ] 11.3 Run ECS task on Fargate

**Marking Scheme Coverage (~20 marks):**

- 2.4 HTTP GET methods (3 marks)
- 2.5 HTTP POST (3 marks)
- 2.6 HTTP PUT (3 marks)
- 2.7 HTTP PATCH (3 marks)
- 2.8 HTTP DELETE (1.5 marks)
- 2.9 Containerize & ECR (2 marks)
- 2.10 ECS Fargate deployment (4 marks)
- Contribution to 2.15 Overall quality (1.5 marks)

**Deliverables:**

- 3 service classes with full business logic
- 3 controllers with all 6 HTTP methods each (18 endpoints total)
- Global error handling middleware
- Swagger UI with complete API documentation
- Dockerfile and Docker image
- API running on AWS ECS Fargate with public endpoint

**Integration Points:**

- Use repository interfaces from Student 1
- Use DTOs from Student 1
- Provide deployed API URL to Student 3 for APigee configuration
- Provide Swagger documentation URL to team

---

## Student 3: API Management & Frontend Client

**Focus:** APigee, React Application, and End-User Interface

### Assigned Tasks

**Primary Responsibilities:**

- [ ] Task 12: Configure Google APigee for API management
  - [ ] 12.1 Create APigee API proxy
  - [ ] 12.2 Implement API key verification policy
  - [ ] 12.3 Create API product and developers
  - [ ] 12.4 Generate developer portal
- [ ] Task 13: Create React web client application
  - [x] 13.1 Initialize React project
  - [ ] 13.2 Create API client service
  - [ ] 13.3 Create TypeScript types/interfaces
  - [ ] 13.4 Implement property service layer
  - [ ] 13.5 Implement user service layer
  - [ ] 13.6 Implement realtor service layer
- [ ] Task 14: Implement React components for Properties
  - [ ] 14.1 Create PropertyList component
  - [ ] 14.2 Create PropertyDetail component
  - [ ] 14.3 Create PropertyForm component for create/edit
  - [ ] 14.4 Implement property delete functionality
- [ ] Task 15: Implement React components for Users
  - [ ] 15.1 Create UserList component
  - [ ] 15.2 Create UserDetail component
  - [ ] 15.3 Create UserForm component for create/edit
  - [ ] 15.4 Implement user delete functionality
- [ ] Task 16: Implement React components for Realtors
  - [ ] 16.1 Create RealtorList component
  - [ ] 16.2 Create RealtorDetail component
  - [ ] 16.3 Create RealtorForm component for create/edit
  - [ ] 16.4 Implement realtor delete functionality
- [ ] Task 17: Implement React routing and navigation
- [ ] Task 18: Build and deploy React application to AWS S3
  - [ ] 18.1 Build React application for production
  - [ ] 18.2 Configure AWS S3 bucket for static hosting
  - [ ] 18.3 Deploy React build to S3

**Marking Scheme Coverage (~25 marks):**

- 2.11 APigee proxy (1 mark)
- 2.12 API Product (1 mark)
- 2.13 Add developers (1 mark)
- 2.12 Verify API key policy (3 marks)
- 2.13 Developer portal (1 mark)
- 2.14.1 HttpClient with API key (1 mark)
- 2.14.2 Invoke all 6 methods × 3 controllers (18 marks)
- Contribution to 2.15 Overall quality (2 marks)
- 3.3 Architecture documentation (4 marks)

**Deliverables:**

- APigee proxy configured with API key verification
- API Product with 2 registered developers
- Developer portal for API key management
- Complete React application with all CRUD operations
- React app deployed on AWS S3
- Architecture diagram for presentation

**Integration Points:**

- Receive deployed API URL from Student 2
- Configure APigee to point to Student 2's ECS endpoint
- Use API endpoint structure defined by Student 2
- Test all endpoints created by Student 2

---

## Shared Responsibilities (All 3 Students)

### Task 19: End-to-end testing and verification

**Everyone participates:**

- Student 1: Verify data persistence in RDS
- Student 2: Verify all API endpoints work correctly
- Student 3: Verify web client invokes all methods successfully
- All: Test complete user flows end-to-end

### Task 20: Create project documentation and presentation materials

**Divide as follows:**

- **Student 1:** ER diagram, database schema documentation, data modeling section
- **Student 2:** API architecture, Swagger documentation, deployment process
- **Student 3:** System architecture diagram, APigee configuration, user interface walkthrough
- **All together:** Prepare presentation, practice demo, prepare Q&A answers, write experiences/lessons learned

### Presentation (10 marks - All participate)

- Each student presents their component (5-7 minutes each)
- All participate in Q&A session
- Demonstrate complete end-to-end functionality together

---

## Timeline Recommendations

### Week 1-2: Foundation

- **Student 1:** Complete Tasks 1-4 (project setup, models, repositories, DTOs)
- **Student 2:** Review Student 1's interfaces, prepare service layer design
- **Student 3:** Research APigee and React setup, plan UI design

### Week 3-4: Core Implementation

- **Student 1:** Complete Task 9 (AWS RDS deployment)
- **Student 2:** Complete Tasks 5-8 (services, controllers, Swagger)
- **Student 3:** Start Task 13 (React project setup and service layer)

### Week 5-7: Cloud Deployment & Integration

- **Student 1:** Support integration, finalize documentation
- **Student 2:** Complete Tasks 10-11 (Docker, ECS deployment)
- **Student 3:** Complete Task 12 (APigee configuration)

### Week 8-9: Frontend Development

- **Student 1:** Review and test API endpoints
- **Student 2:** Support Student 3 with API issues
- **Student 3:** Complete Tasks 14-17 (React components and routing)

### Week 10: Final Integration & Testing

- **Student 3:** Complete Task 18 (S3 deployment)
- **All:** Complete Task 19 (end-to-end testing)
- **All:** Fix any integration issues

### Week 11: Documentation & Presentation

- **All:** Complete Task 20 (documentation and presentation prep)
- **All:** Practice presentation and demo
- **All:** Submit project and present

---

## Communication & Collaboration

### Regular Sync Points

- **Weekly team meetings:** Review progress, discuss blockers, plan next steps
- **Integration checkpoints:** When Student 1 completes repositories, when Student 2 deploys API
- **Code reviews:** Review each other's code for quality and consistency

### Shared Resources

- **GitHub Repository:** All code in shared repo with clear branch strategy
- **Documentation:** Shared Google Doc or Notion for documentation
- **AWS Account:** Shared AWS account with proper IAM permissions
- **APigee Account:** Shared Google Cloud/APigee account

### Critical Dependencies

1. **Student 2 depends on Student 1:** Cannot implement services without repositories and DTOs
2. **Student 3 depends on Student 2:** Cannot configure APigee or build client without deployed API
3. **Everyone depends on Student 1:** Database must be ready for testing

### Risk Mitigation

- Start early on dependencies (Student 1 prioritize repository interfaces)
- Use mock data for parallel development when needed
- Have backup plans for AWS/APigee issues
- Regular testing to catch integration issues early

---

## Success Criteria

### Individual Success

- **Student 1:** All tables in RDS with 10+ rows, repository pattern working, DTOs mapped correctly
- **Student 2:** All 18 endpoints (6 methods × 3 controllers) working, deployed on ECS, Swagger complete
- **Student 3:** APigee configured with API keys, React app with all CRUD operations, deployed on S3

### Team Success

- Complete end-to-end flow: User → React App → APigee → API → RDS
- All 60 implementation marks achievable
- Professional presentation demonstrating all features
- Clear documentation of architecture and learnings

---

## Notes

- This is a **collaborative project** - help each other when blocked
- **Communicate frequently** about changes to interfaces or contracts
- **Test integration points** as soon as components are ready
- **Document as you go** - don't leave it all for the end
- **Ask for help early** if stuck on AWS/APigee configuration
