# Military Asset Management System

This is a full-stack application for managing military assets across multiple bases.

## Features

- Dashboard with key metrics and filters
- Purchase recording
- Asset transfers between bases
- Assignments and expenditures tracking
- Role-based access control

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Setup

1. Install dependencies for backend: `cd backend && npm install`
2. Install dependencies for frontend: `cd frontend && npm install`
3. Start MongoDB
4. Start backend: `cd backend && npm run dev`
5. Start frontend: `cd frontend && npm start`

## API Endpoints

- POST /api/auth/login
- POST /api/auth/register
- GET /api/dashboard
- POST /api/purchases
- GET /api/purchases
- POST /api/transfers
- GET /api/transfers
- POST /api/assignments
- GET /api/assignments