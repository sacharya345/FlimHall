# Architecture

## Overview
FlimHall follows a layered architecture with a client-facing React application and a separate API service. The frontend communicates with the backend through HTTP endpoints, while database concerns remain isolated to service and model layers.

## Frontend
The `client/` directory contains the React application, pages, shared UI components, styles, state hooks, and services used to consume backend APIs.

## Backend
The `server/` directory contains the Express server, route definitions, controller logic, service layer, middleware, and model structure. This separation keeps request handling, validation, and persistence concerns organized.

## Data layer
Database migrations and seed scripts live under `database/` so schema changes can be tracked and applied consistently.

## Documentation
Project requirements and product planning are tracked in the `docs/` folder so delivery decisions remain transparent and team-aligned.
