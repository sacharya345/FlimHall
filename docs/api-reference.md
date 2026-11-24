# FlimHall REST API Reference

Base URL (local): `http://localhost:3000/api`  
Base URL (production): `https://flimhall-api.onrender.com/api`

---

## 1. Health & System Status

### `GET /api/health`
Returns service availability, process uptime, and server ISO timestamp.

**Response (`200 OK`):**
```json
{
  "status": "ok",
  "service": "flimhall-api",
  "uptime": 42.18,
  "timestamp": "2026-11-24T20:00:00.000Z"
}
```

---

## 2. Public Movie & Screening Endpoints

### `GET /api/movies`
Returns available movies ordered alphabetically by title.
- Query parameters:
  - `search` (optional, max 100 chars): Case-insensitive title substring match.
  - `genre` (optional, max 80 chars): Case-insensitive exact genre filter.

### `GET /api/movies/genres`
Returns an alphabetically sorted array of distinct movie genres.

### `GET /api/movies/:id`
Returns full details for a single movie by integer ID (`404` if not found).

### `GET /api/movies/:id/screenings`
Returns upcoming scheduled screenings for a movie, including auditorium name and remaining `available_seats`.
- Query parameters:
  - `date` (optional, `YYYY-MM-DD`): Filters screenings by date.

### `GET /api/screenings/:id/seats`
Returns screening metadata and the complete seat map (`label`, `available`) for an active future screening (`409` if cancelled or already started).

---

## 3. Customer Booking Endpoints

### `POST /api/bookings`
Reserves 1–12 seats for a scheduled screening inside a PostgreSQL transaction using `SELECT ... FOR UPDATE` row locking to prevent double bookings.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "screeningId": 1,
  "seats": ["A1", "A2"]
}
```

**Responses:**
- `201 Created`: Returns confirmed booking object with unique `FH-...` reference and `emailStatus`.
- `400 Bad Request`: Invalid customer details or seat labels.
- `409 Conflict`: Screening unavailable or one or more selected seats are already booked.

### `GET /api/bookings/:reference?email=<customer_email>`
Retrieves a booking matching both the booking reference and verification email address (`404` if not matched).

---

## 4. Staff Authentication & Admin Endpoints

### `POST /api/auth/login`
Authenticates a staff or admin account using `scrypt` password verification and returns an 8-hour signed Bearer token.

### Protected Admin Routes (`Authorization: Bearer <token>`)
- `GET /api/admin/movies` — List all movies.
- `POST /api/admin/movies` — Create a new movie.
- `PUT /api/admin/movies/:id` — Update a movie.
- `DELETE /api/admin/movies/:id` — Delete a movie without screening history (`409` if screenings exist).
- `GET /api/admin/auditoriums` — List all auditoriums and seating dimensions.
- `GET /api/admin/screenings` — List up to 200 recent screenings.
- `POST /api/admin/screenings` — Schedule a new screening (checks auditorium duration overlaps).
- `PUT /api/admin/screenings/:id` — Update a scheduled screening without confirmed bookings.
- `POST /api/admin/screenings/:id/cancel` — Cancel a future screening without confirmed bookings.
- `GET /api/admin/bookings` — List customer bookings (optional `?screeningId=` filter).
- `POST /api/admin/bookings/:id/cancel` — Cancel a confirmed booking at least 2 hours before showtime.
- `GET /api/admin/staff` *(Admin role required)* — List staff and admin accounts.
- `POST /api/admin/staff` *(Admin role required)* — Provision a new staff or admin account.
