import pool from '../db.js';
import { httpError, parseId } from '../utils/httpError.js';

function validateMovie(input) {
  input = input && typeof input === 'object' ? input : {};
  const movie = {
    title: String(input.title || '').trim(),
    description: String(input.description || '').trim(),
    genre: String(input.genre || '').trim(),
    duration_min: Number(input.duration_min),
    age_rating: String(input.age_rating || '').trim(),
    poster_url: String(input.poster_url || '').trim() || null
  };
  if (!movie.title || movie.title.length > 180 || !movie.genre || movie.genre.length > 80
    || !Number.isInteger(movie.duration_min) || movie.duration_min < 1 || movie.duration_min > 600
    || movie.description.length > 5000 || movie.age_rating.length > 20
    || (movie.poster_url && movie.poster_url.length > 2048)
    || (movie.poster_url && !/^https?:\/\//i.test(movie.poster_url))) {
    throw httpError(400, 'Enter a title, genre, valid duration, and optional HTTP(S) poster URL.');
  }
  return movie;
}

async function withTransaction(work) {
  const client = await pool.connect();
  let transactionStarted = false;
  try {
    await client.query('BEGIN');
    transactionStarted = true;
    const result = await work(client);
    await client.query('COMMIT');
    transactionStarted = false;
    return result;
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Screening transaction rollback failed:', rollbackError);
      }
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function listAdminMovies(req, res) {
  const { rows } = await pool.query('SELECT * FROM movies ORDER BY title');
  res.json(rows);
}

export async function createMovie(req, res) {
  const movie = validateMovie(req.body);
  const { rows } = await pool.query(
    `INSERT INTO movies (title, description, genre, duration_min, age_rating, poster_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [movie.title, movie.description, movie.genre, movie.duration_min, movie.age_rating, movie.poster_url]
  );
  res.status(201).json(rows[0]);
}

export async function updateMovie(req, res) {
  const movie = validateMovie(req.body);
  const { rows } = await pool.query(
    `UPDATE movies SET title = $1, description = $2, genre = $3, duration_min = $4,
       age_rating = $5, poster_url = $6, updated_at = now()
     WHERE id = $7 RETURNING *`,
    [movie.title, movie.description, movie.genre, movie.duration_min, movie.age_rating, movie.poster_url, parseId(req.params.id, 'Movie ID')]
  );
  if (!rows[0]) throw httpError(404, 'Movie not found.');
  res.json(rows[0]);
}

export async function deleteMovie(req, res) {
  const { rows } = await pool.query(
    `DELETE FROM movies m WHERE m.id = $1
     AND NOT EXISTS (SELECT 1 FROM screenings s WHERE s.movie_id = m.id) RETURNING m.id`,
    [parseId(req.params.id, 'Movie ID')]
  );
  if (!rows[0]) {
    const { rowCount } = await pool.query('SELECT id FROM movies WHERE id = $1', [req.params.id]);
    if (!rowCount) throw httpError(404, 'Movie not found.');
    throw httpError(409, 'Movies with screening history cannot be deleted.');
  }
  res.status(204).end();
}

export async function listAuditoriums(req, res) {
  const { rows } = await pool.query(
    'SELECT id, name, seat_rows, seat_columns FROM auditoriums ORDER BY name'
  );
  res.json(rows);
}

async function validateScreening(input, screeningId, client) {
  input = input && typeof input === 'object' ? input : {};
  const movieId = Number(input.movie_id);
  const auditoriumId = Number(input.auditorium_id);
  const startsAt = new Date(input.starts_at);
  const basePrice = Number(input.base_price);
  if (!Number.isSafeInteger(movieId) || movieId < 1
    || !Number.isSafeInteger(auditoriumId) || auditoriumId < 1
    || !Number.isFinite(startsAt.getTime()) || startsAt <= new Date()
    || !Number.isFinite(basePrice) || basePrice <= 0 || basePrice > 10000) {
    throw httpError(400, 'Choose a movie, auditorium, future date and time, and positive ticket price.');
  }

  const { rows: movieRows } = await client.query('SELECT duration_min FROM movies WHERE id = $1', [movieId]);
  if (!movieRows[0]) throw httpError(400, 'Selected movie does not exist.');
  const { rows: auditoriumRows } = await client.query(
    'SELECT id FROM auditoriums WHERE id = $1 FOR UPDATE',
    [auditoriumId]
  );
  if (!auditoriumRows[0]) throw httpError(400, 'Selected auditorium does not exist.');

  const { rows: conflicts } = await client.query(
    `SELECT s.id FROM screenings s JOIN movies existing_movie ON existing_movie.id = s.movie_id
     WHERE s.auditorium_id = $1 AND s.status = 'scheduled' AND s.id IS DISTINCT FROM $3
       AND s.starts_at < $2::timestamptz + ($4 * interval '1 minute')
       AND s.starts_at + (existing_movie.duration_min * interval '1 minute') > $2::timestamptz
     LIMIT 1`,
    [auditoriumId, startsAt.toISOString(), screeningId || null, movieRows[0].duration_min]
  );
  if (conflicts[0]) throw httpError(409, 'This auditorium already has a screening at that time.');
  return { movieId, auditoriumId, startsAt, basePrice };
}

export async function listAdminScreenings(req, res) {
  const { rows } = await pool.query(
    `SELECT s.id, s.movie_id, s.auditorium_id, s.starts_at, s.base_price, s.status,
            m.title AS movie_title, a.name AS auditorium
     FROM screenings s JOIN movies m ON m.id = s.movie_id
     JOIN auditoriums a ON a.id = s.auditorium_id
     ORDER BY s.starts_at DESC LIMIT 200`
  );
  res.json(rows);
}

export async function createScreening(req, res) {
  const screening = await withTransaction(async (client) => {
    const values = await validateScreening(req.body, null, client);
    const { rows } = await client.query(
      `INSERT INTO screenings (movie_id, auditorium_id, starts_at, base_price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [values.movieId, values.auditoriumId, values.startsAt.toISOString(), values.basePrice]
    );
    return rows[0];
  });
  res.status(201).json(screening);
}

export async function updateScreening(req, res) {
  const screeningId = parseId(req.params.id, 'Screening ID');
  const screening = await withTransaction(async (client) => {
    const { rows: existing } = await client.query(
      `SELECT id FROM screenings
       WHERE id = $1 AND status = 'scheduled' FOR UPDATE`,
      [screeningId]
    );
    if (!existing[0]) throw httpError(404, 'Scheduled screening not found.');

    const { rows: bookings } = await client.query(
      `SELECT id FROM bookings
       WHERE screening_id = $1 AND status = 'confirmed' LIMIT 1`,
      [screeningId]
    );
    if (bookings[0]) {
      throw httpError(409, 'Screenings with confirmed bookings cannot be edited.');
    }

    const values = await validateScreening(req.body, screeningId, client);
    const { rows } = await client.query(
      `UPDATE screenings SET movie_id = $1, auditorium_id = $2, starts_at = $3, base_price = $4
       WHERE id = $5 RETURNING *`,
      [values.movieId, values.auditoriumId, values.startsAt.toISOString(), values.basePrice, screeningId]
    );
    return rows[0];
  });
  res.json(screening);
}

export async function cancelScreening(req, res) {
  const { rows } = await pool.query(
    `UPDATE screenings SET status = 'cancelled'
     WHERE id = $1 AND status = 'scheduled' AND starts_at > now()
     AND NOT EXISTS (
       SELECT 1 FROM bookings b WHERE b.screening_id = screenings.id AND b.status = 'confirmed'
     ) RETURNING id`,
    [parseId(req.params.id, 'Screening ID')]
  );
  if (!rows[0]) throw httpError(409, 'Screening cannot be cancelled because it is unavailable or has confirmed bookings.');
  res.json({ message: 'Screening cancelled.' });
}

export async function listBookings(req, res) {
  const screeningId = req.query.screeningId
    ? parseId(req.query.screeningId, 'Screening ID')
    : null;
  const { rows } = await pool.query(
    `SELECT b.id, b.booking_ref, b.customer_name, b.customer_email, b.total_price,
            b.status, b.created_at, m.title AS movie_title, s.starts_at,
            COALESCE(array_agg(bs.seat_label ORDER BY bs.seat_label)
              FILTER (WHERE bs.seat_label IS NOT NULL), '{}') AS seats
     FROM bookings b JOIN screenings s ON s.id = b.screening_id
     JOIN movies m ON m.id = s.movie_id
     LEFT JOIN booking_seats bs ON bs.booking_id = b.id
     WHERE ($1::integer IS NULL OR b.screening_id = $1)
     GROUP BY b.id, m.title, s.starts_at ORDER BY b.created_at DESC LIMIT 500`,
    [screeningId]
  );
  res.json(rows);
}

export async function cancelBooking(req, res) {
  const { rows } = await pool.query(
    `UPDATE bookings b SET status = 'cancelled'
     FROM screenings s
     WHERE b.id = $1 AND s.id = b.screening_id AND b.status = 'confirmed'
       AND s.status = 'scheduled' AND s.starts_at > now() + interval '2 hours'
     RETURNING b.booking_ref`,
    [parseId(req.params.id, 'Booking ID')]
  );
  if (!rows[0]) throw httpError(409, 'Booking is not eligible for cancellation. Cancellations close two hours before showtime.');
  res.json({ message: `Booking ${rows[0].booking_ref} cancelled.` });
}
