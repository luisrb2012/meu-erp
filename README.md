# Meu ERP

This repository contains a small ERP example with a Node.js backend and a React frontend.

## Getting Started

### Backend
1. Navigate to the `backend` directory.
2. Copy `.env.example` to `.env` and update the values as needed.
3. Install dependencies with `npm install` (if `node_modules` is not already present).
4. Start the server with `npm run dev` or `npm start`.

The backend expects a PostgreSQL database accessible with the credentials provided in the `.env` file.

### Frontend
1. Navigate to the `frontend` directory.
2. Copy `.env.example` to `.env` and adjust `VITE_API_URL` if your backend runs on a different host or port.
3. Install dependencies with `npm install` (if `node_modules` is not already present).
4. Start the development server with `npm run dev`.

The frontend will fetch data from the API URL defined in the environment file.
