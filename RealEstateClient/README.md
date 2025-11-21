# Real Estate Web Client

A React TypeScript web application for managing real estate properties, users, and realtors. This client consumes the Real Estate API through Google APigee API gateway.

## Technology Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios (to be implemented)
- **Routing**: React Router (to be implemented)
- **Styling**: CSS (to be enhanced)

## Project Structure

```
src/
├── components/          # React components
│   ├── properties/      # Property-related components
│   ├── users/          # User-related components
│   ├── realtors/       # Realtor-related components
│   └── common/         # Shared components
├── services/           # API service layer
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Real Estate API running (locally or deployed)
- APigee API key for authentication

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update:
   ```bash
   VITE_API_BASE_URL=https://your-apigee-url.com/api
   VITE_API_KEY=your-api-key-here
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   
   Navigate to: `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Features (To Be Implemented)

### Properties Management
- View all properties
- View property details
- Create new properties
- Edit existing properties
- Delete properties

### Users Management
- View all users
- View user details
- Create new users
- Edit existing users
- Delete users

### Realtors Management
- View all realtors
- View realtor details
- Create new realtors
- Edit existing realtors
- Delete realtors

## API Integration

The application will communicate with the Real Estate API through:
- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Authentication**: API key in `x-api-key` header
- **Format**: JSON requests/responses

## Deployment

The application will be deployed to AWS S3 as a static website:

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

## Development Status

- ✅ Project initialization with Vite + React + TypeScript
- ✅ Basic project structure created
- ✅ Environment configuration setup
- ⏳ API service layer implementation
- ⏳ React components development
- ⏳ Routing implementation
- ⏳ UI/UX design and styling

## Team Assignment

This frontend application is assigned to **Student 3** as part of the Real Estate API project.

## License

This project is for educational purposes as part of a college assignment.