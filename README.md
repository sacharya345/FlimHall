# FlimHall

FlimHall is a full-stack movie theater booking application with a React/Vite
frontend, an Express API, and PostgreSQL persistence.

## Features

- Browse, search, and filter movies by genre; view release years, details, and future showtimes.
- View seat availability, choose seats, check prices, and confirm bookings.
- Retrieve a booking using its reference and booking email.
- Staff sign-in and protected tools to manage movies, screenings, and bookings.
- Cancel eligible bookings (at least two hours before showtime).
- Send confirmation emails when SMTP is configured.

## Requirements

- Node.js 20.19+ or 22.12+
- PostgreSQL 14+

## Run locally

Configure PostgreSQL, then set up the API:

```powershell
createdb flimhall
cd server
Copy-Item .env.example .env
```

If `createdb` is unavailable, create the `flimhall` database using your
PostgreSQL administration tool. Edit `server/.env` with the database
credentials and set `JWT_SECRET` to a private random value of at least 32
characters. To provision the initial staff account, set `ADMIN_EMAIL` and
`ADMIN_PASSWORD` (at least 12 characters) before running setup. Configure the
optional `SMTP_*` settings to send confirmation emails. Demo ticket prices are
shown in USD.

```powershell
npm install
npm run db:setup
npm run dev
```

In another terminal:

```powershell
cd client
npm install
npm run dev
```

The website runs at `http://localhost:5173`, and the API runs at
`http://localhost:3000`. The health check is
`http://localhost:3000/api/health`.

The database setup command applies the schema in
[`database/migrations/001_init.sql`](./database/migrations/001_init.sql) and
adds sample movies, auditoriums, and upcoming screenings from
[`database/seeds/001_demo_data.sql`](./database/seeds/001_demo_data.sql).
It is safe to run again; sample data is not duplicated.

## Policies and configuration

- A booking reference and matching customer email are both required to retrieve
  booking details.
- Booking cancellation is available to staff until two hours before the
  screening.
- A screening cannot be cancelled if it has confirmed bookings.
- A screening with confirmed bookings cannot be edited.
- A movie with screening history cannot be deleted; edit it or cancel its
  future screenings instead.
- Booking confirmation does not depend on email delivery. If SMTP is missing or
  delivery fails, the booking remains saved and the result tells the customer
  to keep their reference.
- Set `VITE_API_BASE_URL` in the client environment to use a different API URL.

## Project structure
<<<<<<< HEAD
=======
- `client/` contains of the frontend application
- `server/` contains of the API layer and business logic
- `database/` contains schema and seed-related files
- `docs/` contains project planning and requirements assets
>>>>>>> 7b8dc4b (commit)

- `client/` — React application
- `server/` — Express API, authentication, and business logic
- `database/` — PostgreSQL migration and demo seed
- `docs/` — planning and requirements
