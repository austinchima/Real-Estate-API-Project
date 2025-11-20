# **IT Project Proposal: Real Estate Data API and Search Web App**

Submission date: 14/11/2025

Submitted by: Austin Chima.

**Project Introduction**

This project is a **Minimal Viable Product (MVP)** designed to demonstrate core full-stack development and cloud deployment principles. The scope encompasses the development of a **RESTful API** using **C\# (ASP.NET Core)** to manage an inventory of property data and some user and realtor data, alongside a simple **Web Application** to consume and display this information. The API component will utilize a **Three-Layered Architecture** with the **Repository Pattern**: Controllers for handling HTTP requests, a Service Layer for business logic, and a Data Layer (via **Entity Framework Core**) handling the database connection. Initially, a local database (**SQLite/LocalDB**) will be used for clarity and testability. A key objective of this exercise is the **fundamental cloud deployment** of the complete solution on **Amazon Web Services (AWS)**, specifically utilizing services like **Fargate, RDS, S3, and IAM**.

**Project objectives/Goal(s):** The aim is to demonstrate core IT competency by building an operational data pipeline from a database to a web client and deploying the entire stack into the cloud. We seek to resolve the problem of basic data access through the implementation of a simple, standardized RESTful API capable of handling property records: Create, Read, Update, Delete. The major beneficiaries are the student team that develops practical experience in data modeling, network communication, and cloud service provisioning, and academic assessors who can more easily evaluate the core technical skills. If this simple system is not implemented, an opportunity will be lost to apply and test fundamental database, C\# development, and cloud deployment skills in a cohesive, practical project environment.  
This project will develop an MVP to demonstrate core full-stack development and cloud deployment skills. The major components will be a simple RESTful API, developed in C\# utilizing ASP.NET Core, to manage property data, and a basic web application that displays and manages that data. The API shall utilize a live, non-static set of property records. The aim of this project is to show competence in the whole data pipeline: the creation of an API, developing a front-end to consume and manage that data, and performing basic cloud deployment using Amazon Web Services.

**Project target customers**

Our main target customers for this prototype are the academic assessors and college professors who require a clear, functional project to review the team's mastery of essential full-stack development skills. The secondary targets will be any developer or student who requires a simple, publicly available JSON endpoint for practice in consuming API data or any general user interested in browsing the small sample property inventory provided by the accompanying Web Application. We are prioritizing simplicity and focusing the scope on demonstrating technical proficiency rather than solving complex market problems.  

**Project Features**

Project features are strictly limited to the bare minimum required to demonstrate the core pipeline. This means the RESTful API should be able to perform at least CRUD operations on the property data model, and include a very basic filtering mechanism, such as filtering by property type. The Web Application accompanying this should merely display, on a single page, all properties returned from that API, including a simple search box utilizing the API's filtering. Anything beyond minimal styling is strictly nice-to-have and will only be pursued when the core data flow and essential endpoints are operating fully and verified. Success will be based entirely on the successful execution of these core CRUD and display functions.

**Projected Project Tools & Resources**

|  | Project Needs  |
| ----- | ----- |
| Hardware | Personal Laptops/Workstations for development. Basic Internet connectivity. |
| Software | **C\#** using **ASP.NET Core**. **Database:** **SQLite** (file-based, running alongside the API instance) or SQL Server Express LocalDB for easier C\# integration. **Frontend/Web App:** Pure HTML/CSS/JavaScript. **Version Control:** Git and GitHub. **IDE:** Visual Studio. |
| Other (Please specify) | **API Containerization:** **Docker** (to package the C\# API). **Container Registry:** **Amazon Elastic Container Registry (ECR)** (to store the Docker image).**API Hosting:** **AWS Fargate** (as the compute engine within an **ECS Cluster**—serverless containers). **Web App Hosting:** **Amazon S3** (for static website hosting).**Account:** **AWS Free Tier Account.** |

**Project challenges**

* Deployment: Initial setup and configuration of AWS Elastic Beanstalk and Amazon S3 will represent a complex technical hurdle. Mitigation: Rely heavily on the AWS tutorials along with the AWS Toolkit for Visual Studio to help simplify the deployment.  

* Front-End Integration \- Ensuring the JavaScript handles asynchronous data retrieval correctly from the C\# API and a few basic error states over a live AWS endpoint. Mitigation: Employ pure and simple fetch() commands with minimum DOM manipulation.
