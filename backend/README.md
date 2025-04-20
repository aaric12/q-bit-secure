# QBit Secure Backend

This is the backend for the QBit Secure quantum security platform. It provides API endpoints for authentication, dashboard data, analytics, security features, and quantum simulations.

## Features

- User authentication (register, login, logout)
- Dashboard data retrieval
- Analytics data retrieval
- Security features (eavesdropping detection, anomaly detection)
- Quantum key distribution simulation

## Database Schema

The backend uses a PostgreSQL database with the following tables:

- `users`: Stores user information
- `sessions`: Manages user sessions
- `security_logs`: Tracks security events
- `simulation_results`: Stores quantum simulation data
- `analytics_data`: Stores analytics metrics
- `dashboard_metrics`: Stores dashboard data
- `quantum_keys`: Stores generated quantum keys

## API Endpoints

### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in a user
- `POST /api/auth/logout`: Log out a user

### Dashboard

- `GET /api/dashboard/summary`: Get dashboard summary data

### Analytics

- `GET /api/analytics/summary`: Get analytics summary data

### Security

- `POST /api/security/eavesdropping`: Run eavesdropping detection
- `GET /api/security/anomalies/timeline`: Get anomaly timeline

### Simulation

- `POST /api/simulation/full`: Run a full quantum key distribution simulation

## Environment Variables

The backend requires the following environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation

## Getting Started

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Set up environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

3. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

## Deployment

The backend can be deployed to Vercel or any other serverless platform that supports Next.js API routes.
\`\`\`

Let's create a .env.example file:

```plaintext file="backend/.env.example"
# Database
DATABASE_URL=postgres://username:password@hostname:port/database

# Authentication
JWT_SECRET=your-secret-key-here
