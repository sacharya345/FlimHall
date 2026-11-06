import pool from '../db.js';
import { httpError, parseId } from '../utils/httpError.js';

export async function listMovies(req, res) {
  const search = String(req.query.search || '').trim();
  const genre = String(req.query.genre || '').trim();
  if (search.length > 100 || genre.length > 80) {
    throw httpError(400, 'Search titles must be 100 characters or fewer and genres 80 characters or fewer.');
  }
  const { rows } = await pool.query(
    `SELECT m.id, m.title, m.description, m.genre, m.duration_min, m.age_rating,
            m.poster_url, m.created_at,
            EXISTS (
              SELECT 1 FROM screenings s
              WHERE s.movie_id = m.id AND s.status = 'scheduled' AND s.starts_at > now()
            ) AS has_upcoming_screenings
     FROM movies m
     WHERE ($1 = '' OR m.title ILIKE '%' || $1 || '%')
       AND ($2 = '' OR lower(m.genre) = lower($2))
     ORDER BY m.title`,
    [search, genre]
  );
  res.json(rows);
}

export async function getMovie(req, res) {
  const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [parseId(req.params.id, 'Movie ID')]);
  if (!rows[0]) throw httpError(404, 'Movie not found.');
  res.json(rows[0]);
}

export async function listGenres(req, res) {
  const { rows } = await pool.query(
    'SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL AND genre <> \'\' ORDER BY genre'
  );
  res.json(rows.map((row) => row.genre));
}

export async function listScreenings(req, res) {
  const date = String(req.query.date || '');
  const parsedDate = date ? new Date(`${date}T00:00:00.000Z`) : null;
  if (date && (!/^\d{4}-\d{2}-\d{2}$/.test(date)
    || !Number.isFinite(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date)) {
    throw httpError(400, 'Date must use YYYY-MM-DD format.');
  }
  const { rows } = await pool.query(
    `SELECT s.id, s.starts_at, s.base_price, s.status, a.name AS auditorium,
            m.duration_min,
            a.seat_rows * a.seat_columns -
              (SELECT count(*) FROM booking_seats bs
               JOIN bookings b ON b.id = bs.booking_id
               WHERE bs.screening_id = s.id AND b.status = 'confirmed') AS available_seats
     FROM screenings s
     JOIN auditoriums a ON a.id = s.auditorium_id
     JOIN movies m ON m.id = s.movie_id
     WHERE s.movie_id = $1 AND s.status = 'scheduled' AND s.starts_at > now()
       AND ($2 = '' OR s.starts_at::date = $2::date)
     ORDER BY s.starts_at`,
    [parseId(req.params.id, 'Movie ID'), date]
  );
  res.json(rows);
}

export async function getSeats(req, res) {
  const screeningId = parseId(req.params.id, 'Screening ID');
  const { rows } = await pool.query(
    `SELECT s.id, s.status, s.starts_at, s.base_price,
            a.seat_rows, a.seat_columns, a.name AS auditorium
     FROM screenings s JOIN auditoriums a ON a.id = s.auditorium_id
     WHERE s.id = $1`,
    [screeningId]
  );
  const screening = rows[0];
  if (!screening) throw httpError(404, 'Screening not found.');
  if (screening.status !== 'scheduled' || new Date(screening.starts_at) <= new Date()) {
    throw httpError(409, 'This screening is no longer available.');
  }

  const { rows: bookedRows } = await pool.query(
    `SELECT bs.seat_label FROM booking_seats bs
     JOIN bookings b ON b.id = bs.booking_id
     WHERE bs.screening_id = $1 AND b.status = 'confirmed'`,
    [screeningId]
  );
  const booked = new Set(bookedRows.map((row) => row.seat_label));
  const seats = [];
  for (let row = 0; row < screening.seat_rows; row += 1) {
    for (let col = 1; col <= screening.seat_columns; col += 1) {
      const label = `${String.fromCharCode(65 + row)}${col}`;
      seats.push({ label, available: !booked.has(label) });
    }
  }
  res.json({
    screening: {
      id: screening.id,
      starts_at: screening.starts_at,
      base_price: screening.base_price,
      auditorium: screening.auditorium
    },
    seats
  });
}
