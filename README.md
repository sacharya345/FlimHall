# FlimHall

FlimHall is a full-stack web application with a React frontend and an Express backend.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL dependency is present; database connectivity and schema
  are not yet implemented.

## Getting started

Install dependencies in each application directory if they are not installed:

```powershell
cd client
npm install
npm run dev
```

In another terminal:

```powershell
cd server
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the API at
`http://localhost:3000`. The API health check is
`http://localhost:3000/api/health`.

## Project structure
- `client/` contains of the frontend application
- `server/` contains of the API layer and business logic
- `database/` contains schema and seed-related files
- `docs/` contains project planning and requirements assets

## Project planning

- [Requirements draft](./docs/requirements.md) — pending supervisor review
- [Product backlog](./docs/product-backlog.md) — initial MoSCoW priorities
- [Team roles](./docs/team-roles.md) — proposed responsibilities awaiting
  assignment
- [Git workflow](./docs/git-workflow.md) — proposal awaiting team agreement
