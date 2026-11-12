CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

CREATE TABLE IF NOT EXISTS movies (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  genre TEXT NOT NULL,
  duration_min INTEGER NOT NULL CHECK (duration_min > 0),
  age_rating TEXT NOT NULL DEFAULT 'Not rated',
  poster_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS movies_title_lower_idx ON movies (lower(title));

CREATE TABLE IF NOT EXISTS auditoriums (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  seat_rows INTEGER NOT NULL CHECK (seat_rows BETWEEN 1 AND 26),
  seat_columns INTEGER NOT NULL CHECK (seat_columns BETWEEN 1 AND 50)
);

CREATE TABLE IF NOT EXISTS screenings (
  id BIGSERIAL PRIMARY KEY,
  movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE RESTRICT,
  auditorium_id BIGINT NOT NULL REFERENCES auditoriums(id) ON DELETE RESTRICT,
  starts_at TIMESTAMPTZ NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price > 0),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS screenings_movie_start_idx ON screenings (movie_id, starts_at);
CREATE INDEX IF NOT EXISTS screenings_auditorium_start_idx ON screenings (auditorium_id, starts_at);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  booking_ref TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  screening_id BIGINT NOT NULL REFERENCES screenings(id) ON DELETE RESTRICT,
  total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_screening_status_idx ON bookings (screening_id, status);
CREATE INDEX IF NOT EXISTS bookings_email_ref_idx ON bookings (lower(customer_email), booking_ref);

CREATE TABLE IF NOT EXISTS booking_seats (
  id BIGSERIAL PRIMARY KEY,
  booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE RESTRICT,
  screening_id BIGINT NOT NULL REFERENCES screenings(id) ON DELETE RESTRICT,
  seat_label TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);
CREATE INDEX IF NOT EXISTS booking_seats_screening_idx ON booking_seats (screening_id, seat_label);
CREATE INDEX IF NOT EXISTS booking_seats_booking_idx ON booking_seats (booking_id);
