# QBit Secure Prisma Backend

This is the backend for the QBit Secure quantum security platform, built with Prisma ORM and NeonDB.

## Features

- User authentication (register, login, logout)
- Dashboard data retrieval
- Analytics data retrieval
- Security features (eavesdropping detection, anomaly detection)
- Quantum key distribution simulation

## Tech Stack

- Next.js API Routes
- Prisma ORM
- NeonDB (PostgreSQL)
- TypeScript
- JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- NeonDB account

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your NeonDB connection string and JWT secret.

5. Generate Prisma client:

\`\`\`bash
npx prisma generate
\`\`\`

6. Run database migrations:

\`\`\`bash
npx prisma migrate dev
\`\`\`

7. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

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

## Database Schema

The database schema is defined in `prisma/schema.prisma` and includes the following models:

- `User`: User information
- `Session`: User sessions
- `SecurityLog`: Security event logs
- `Simulation`: Quantum simulation results
- `AnalyticsData`: Analytics metrics
- `DashboardMetric`: Dashboard metrics
- `QuantumKey`: Generated quantum keys

## Development

### Prisma Studio

You can use Prisma Studio to view and edit your database:

\`\`\`bash
npx prisma studio
\`\`\`

### Migrations

When you make changes to the Prisma schema, you need to create a migration:

\`\`\`bash
npx prisma migrate dev --name your_migration_name
\`\`\`

## Deployment

This backend can be deployed to Vercel or any other serverless platform that supports Next.js API routes.

Make sure to set up the environment variables in your deployment platform.
\`\`\`

Let's create a .env.example file:

```plaintext file=".env.example"
# Database
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"

# Authentication
JWT_SECRET="your-secret-key-here"
