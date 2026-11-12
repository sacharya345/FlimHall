# FlimHall Architecture

This document is a working architecture template for the FlimHall project. It reflects the current project structure and can be expanded as the booking system grows from a prototype into a production-ready ticketing platform.

## 1. Overview

FlimHall is a movie theater booking platform that allows customers to browse movies, view schedules, select seats, and complete bookings. It also provides theater staff with tools to manage movies, screenings, and bookings.

The system follows a modular, layered architecture:
- Frontend: React + Vite client application
- Backend: Node.js + Express REST API
- Data layer: PostgreSQL for persistence
- Shared project artifacts: `database/`, `docs/`, and configuration files

## 2. Architectural Goals

- Separate user-facing experience from business logic and data access
- Keep API endpoints simple and maintainable
- Support future growth in user accounts, payments, and staff workflows
- Make booking integrity reliable by enforcing server-side validation
- Keep the project easy to test and evolve by domain-based module boundaries

## 3. High-Level System Architecture

```text
+-----------------------------------------------------------+
|                       Client / Browser                     |
|  React SPA (Vite)                                         |
|  - Home / Movie listing                                   |
|  - Movie details                                           |
|  - Screening selection                                     |
|  - Booking flow                                           |
|  - Staff dashboard (future)                                |
+---------------------------+-------------------------------+
                            |
                            | HTTP / JSON
                            v
+-----------------------------------------------------------+
|                    API Layer (Express)                     |
|  server/src/app.js                                        |
|  - Route registration                                     |
|  - Middleware (CORS, JSON parsing, logging, errors)       |
|  - Controllers                                            |
|  - Services / domain logic                                |
|  - Validation                                             |
+---------------------------+-------------------------------+
                            |
                            | Business logic / queries
                            v
+-----------------------------------------------------------+
|                     Data / Persistence                     |
|  PostgreSQL                                               |
|  - Movies                                                  |
|  - Screenings                                             |
|  - Seats                                                  |
|  - Bookings                                               |
|  - Users / staff accounts (future)                        |
+-----------------------------------------------------------+
```

## 4. Layered Design

### 4.1 Presentation Layer
Location: `client/`

Responsibilities:
- Render movie listings and detail pages
- Capture user booking actions
- Display screening information and seat availability
- Communicate with the API layer through HTTP clients/services
- Manage frontend state and UI feedback

Typical structure:
- `client/src/pages/` — top-level pages
- `client/src/components/` — reusable UI widgets
- `client/src/features/` — business features or feature-based modules
- `client/src/services/` — API calls to the backend
- `client/src/hooks/` — custom React hooks
- `client/src/styles/` — theme and shared styling

### 4.2 API Layer
Location: `server/src/`

Responsibilities:
- Expose REST endpoints for frontend and admin workflows
- Parse request bodies and query parameters
- Apply middleware such as CORS, validation, error handling, and auth checks
- Delegate business logic to service modules
- Return structured JSON responses

Current structure:
- `server/src/app.js` — Express app construction
- `server/src/server.js` — startup and port configuration
- `server/src/routes/` — endpoint definitions
- `server/src/controllers/` — request handling and response shaping
- `server/src/services/` — business logic and orchestration
- `server/src/middleware/` — reusable request processing
- `server/src/models/` — database entity definitions or data access layers
- `server/src/config/` — environment and configuration settings
- `server/src/utils/` — helper functions

### 4.3 Data Access Layer
Location: `database/`

Responsibilities:
- Store movie, screening, seat, and booking records
- Enforce relationships between entities
- Prevent duplicate or conflicting seat reservations
- Support reporting and admin operations

Expected entities include:
- Movie
- Genre
- Screening
- Auditorium
- Seat
- Booking
- Customer
- Staff user (future)

## 5. Core User Flows

### 5.1 Customer Browsing Flow
1. User opens the frontend application
2. React page requests movie list from the API
3. Express route resolves the request
4. Service layer retrieves available movie data from PostgreSQL
5. UI renders movie cards, schedules, and detail views

### 5.2 Booking Flow
1. Customer selects a movie
2. System fetches screenings and seat data
3. Customer selects available seats and a screening
4. Frontend sends booking request to the API
5. Backend validates seat availability and pricing rules
6. Database creates a booking record only if the seat is still available
7. Backend returns a booking reference and confirmation response

### 5.3 Staff Management Flow
1. Authorized staff logs in or authenticates
2. Staff accesses admin screens for movie and screening management
3. API validates permission before modifying data
4. Changes are persisted to the database
5. Public-facing frontend sees updated state after refresh or re-fetch

## 6. Proposed Domain Model

A suitable high-level model for FlimHall is:

- Movie
  - id
  - title
  - description
  - rating
  - duration
  - release_date
  - poster_url

- Screening
  - id
  - movie_id
  - auditorium_id
  - start_time
  - end_time
  - ticket_price

- Auditorium
  - id
  - name
  - total_seats

- Seat
  - id
  - auditorium_id
  - row_label
  - seat_number
  - is_available

- Booking
  - id
  - screening_id
  - customer_id
  - booking_reference
  - total_price
  - status
  - created_at

- Customer
  - id
  - name
  - email
  - phone

This structure can be expanded with payment, cancellation, and staff roles as product requirements evolve.

## 7. Cross-Cutting Concerns

### 7.1 Validation and Integrity
- Validate request payloads before persistence
- Check seat availability before creating bookings
- Enforce server-side authorization for staff actions
- Prevent race conditions on concurrent bookings

### 7.2 Security
- Use environment variables for secrets and configuration
- Restrict CORS to trusted frontend origins
- Protect staff routes with authentication and role checks
- Sanitize and validate API input

### 7.3 Error Handling
- Use centralized middleware for API errors
- Return consistent JSON error payloads
- Log failures for debugging and monitoring

### 7.4 Observability
- Add structured logging for API requests and failures
- Track request latency and error rates
- Monitor database connection health and transaction failures

## 8. Deployment and Environment Model

Current local development flow:
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:3000`
- Shared environment variables are stored in `.env` files

Planned production model:
- Frontend served via static hosting or deployment platform
- Backend hosted as a Node.js service
- PostgreSQL hosted in managed cloud infrastructure
- CI/CD pipeline for automated testing and deployment

## 9. Current Project Layout

```text
FlimHall/
├── client/                  # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   ├── tests/
│   └── package.json
├── database/               # DB schema, migrations, seed scripts
├── docs/                   # Requirements, backlog, workflow documents
├── README.md               # Project overview and startup steps
├── architecture.md         # System design template
├── package.json            # Root package metadata (if used)
└── .gitignore
```

## 10. Recommended Future Improvements

- Introduce authentication and role-based access control for staff
- Add database migrations and a schema versioning workflow
- Separate controllers and services into feature-specific modules
- Add caching for frequently requested movie listings and schedules
- Add payment and cancellation flows
- Add automated tests for bookings, seat locking, and API contracts
- Introduce Docker or deployment manifests for consistent environments

## 11. Architecture Decision Summary

The current architecture intentionally keeps the system simple and easy to reason about:
- React frontend for user interaction
- Express API for consistent backend entry points
- PostgreSQL for transactional booking data
- Domain-oriented folders to support future growth

This is a strong foundation for a ticket-booking product, and it can evolve into a more specialized, scalable architecture as the user base and business requirements grow.
