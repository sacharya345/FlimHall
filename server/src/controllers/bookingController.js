import { randomBytes } from 'node:crypto';
import pool from '../db.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import { httpError } from '../utils/httpError.js';

let bookingSchemaEnsured = false;

async function ensureBookingSchema() {
  if (bookingSchemaEnsured) return;
  await pool.query(`
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'paid';
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transaction_id TEXT;
  `);
  bookingSchemaEnsured = true;
}

function createBookingReference() {
  return `FH-${randomBytes(5).toString('hex').toUpperCase()}`;
}

async function resolveOrCreateScreening(client, { screeningId, movieInput, screeningInput }) {
  if (Number.isSafeInteger(screeningId) && screeningId >= 1) {
    const { rows } = await client.query(
      `SELECT s.id, s.starts_at, s.base_price, s.status, m.title AS movie_title,
              a.seat_rows, a.seat_columns, a.name AS auditorium
       FROM screenings s
       JOIN movies m ON m.id = s.movie_id
       JOIN auditoriums a ON a.id = s.auditorium_id
       WHERE s.id = $1 FOR UPDATE OF s`,
      [screeningId]
    );
    if (rows[0]) {
      const found = rows[0];
      const requestedTitle = String(movieInput?.title || '').trim();
      if (!requestedTitle || found.movie_title.toLowerCase() === requestedTitle.toLowerCase()) {
        return found;
      }
    }
  }

  // Auto-provision movie, auditorium, and screening when booking a frontend catalog showtime
  const title = String(movieInput?.title || 'FlimHall Feature').trim().slice(0, 180);
  const description = String(movieInput?.description || '').trim().slice(0, 5000);
  const genre = String(movieInput?.genre || 'Drama').trim().slice(0, 80);
  const durationMin = Number.isInteger(Number(movieInput?.duration_min)) && Number(movieInput?.duration_min) > 0
    ? Number(movieInput.duration_min)
    : 120;
  const ageRating = String(movieInput?.age_rating || 'PG-13').trim().slice(0, 20);
  const releaseYear = Number.isInteger(Number(movieInput?.release_year))
    && Number(movieInput?.release_year) >= 1888
    && Number(movieInput?.release_year) <= 2100
    ? Number(movieInput.release_year)
    : 2024;
  const posterUrl = String(movieInput?.poster_url || '').trim() || null;

  const { rows: movieRows } = await client.query(
    `INSERT INTO movies (title, description, genre, duration_min, age_rating, release_year, poster_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (lower(title)) DO UPDATE SET
       updated_at = now()
     RETURNING id, title`,
    [title, description, genre, durationMin, ageRating, releaseYear, posterUrl]
  );
  const movie = movieRows[0];

  const auditoriumName = String(screeningInput?.auditorium || 'Oulu — Auditorium 1 (100 seats)').trim();
  const is200 = auditoriumName.includes('200') || auditoriumName.includes('Auditorium 2') || auditoriumName.includes('Screen 2');
  const seatRows = is200 ? 21 : 10;
  const seatCols = 10;

  const { rows: audRows } = await client.query(
    `INSERT INTO auditoriums (name, seat_rows, seat_columns)
     VALUES ($1, $2, $3)
     ON CONFLICT (name) DO UPDATE SET
       seat_rows = GREATEST(auditoriums.seat_rows, EXCLUDED.seat_rows)
     RETURNING id, name, seat_rows, seat_columns`,
    [auditoriumName, seatRows, seatCols]
  );
  const auditorium = audRows[0];

  const parsedStart = screeningInput?.starts_at ? new Date(screeningInput.starts_at) : null;
  const startsAt = parsedStart && Number.isFinite(parsedStart.getTime()) && parsedStart > new Date()
    ? parsedStart.toISOString()
    : new Date(Date.now() + 2 * 3600_000).toISOString();
  const basePrice = Number(screeningInput?.base_price) > 0 ? Number(screeningInput.base_price) : 14.0;

  const { rows: existingScr } = await client.query(
    `SELECT s.id, s.starts_at, s.base_price, s.status
     FROM screenings s
     WHERE s.movie_id = $1 AND s.auditorium_id = $2 AND s.status = 'scheduled' AND s.starts_at > now()
     ORDER BY ABS(EXTRACT(EPOCH FROM (s.starts_at - $3::timestamptz))) ASC
     LIMIT 1 FOR UPDATE OF s`,
    [movie.id, auditorium.id, startsAt]
  );

  if (existingScr[0]) {
    return {
      ...existingScr[0],
      movie_title: movie.title,
      seat_rows: auditorium.seat_rows,
      seat_columns: auditorium.seat_columns,
      auditorium: auditorium.name
    };
  }

  const { rows: createdScr } = await client.query(
    `INSERT INTO screenings (movie_id, auditorium_id, starts_at, base_price, status)
     VALUES ($1, $2, $3, $4, 'scheduled')
     RETURNING id, starts_at, base_price, status`,
    [movie.id, auditorium.id, startsAt, basePrice]
  );

  return {
    ...createdScr[0],
    movie_title: movie.title,
    seat_rows: auditorium.seat_rows,
    seat_columns: auditorium.seat_columns,
    auditorium: auditorium.name
  };
}

export async function createBooking(req, res) {
  await ensureBookingSchema();
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const customerName = String(body.name || '').trim();
  const customerEmail = String(body.email || '').trim().toLowerCase();
  const screeningId = Number(body.screeningId);
  const seats = [...new Set((Array.isArray(body.seats) ? body.seats : [])
    .map((seat) => String(seat).trim().toUpperCase()))];
  const paymentStatus = String(body.paymentStatus || 'paid').trim();
  const transactionId = body.transactionId ? String(body.transactionId).trim() : null;
  const customTotalPrice = Number(body.totalPrice);

  if (!customerName || customerName.length > 120 || customerEmail.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw httpError(400, 'A name and valid email address are required.');
  }
  if (seats.length === 0 || seats.length > 12
    || seats.some((seat) => !/^[A-Z]\d{1,2}$/.test(seat))) {
    throw httpError(400, 'Choose between 1 and 12 valid seats.');
  }

  const client = await pool.connect();
  let booking;
  let transactionStarted = false;
  try {
    await client.query('BEGIN');
    transactionStarted = true;

    const screening = await resolveOrCreateScreening(client, {
      screeningId,
      movieInput: body.movie,
      screeningInput: body.screening
    });

    if (!screening || screening.status !== 'scheduled' || new Date(screening.starts_at) <= new Date()) {
      throw httpError(409, 'This screening is no longer available.');
    }

    const maxRowIndex = Math.max(Number(screening.seat_rows) || 10, 21);
    const maxColIndex = Math.max(Number(screening.seat_columns) || 10, 12);
    const validSeats = new Set(['W1', 'W2', 'W3', 'W4']);
    for (let row = 0; row < maxRowIndex; row += 1) {
      for (let col = 1; col <= maxColIndex; col += 1) {
        validSeats.add(`${String.fromCharCode(65 + row)}${col}`);
      }
    }
    if (seats.some((seat) => !validSeats.has(seat))) {
      throw httpError(400, 'One or more selected seats do not exist.');
    }

    const { rows: occupiedRows } = await client.query(
      `SELECT bs.seat_label FROM booking_seats bs
       JOIN bookings b ON b.id = bs.booking_id
       WHERE bs.screening_id = $1 AND b.status = 'confirmed' AND bs.seat_label = ANY($2)`,
      [screening.id, seats]
    );
    if (occupiedRows.length) {
      throw httpError(409, `These seats are no longer available: ${occupiedRows.map((row) => row.seat_label).join(', ')}.`);
    }

    const totalPrice = Number.isFinite(customTotalPrice) && customTotalPrice >= 0
      ? customTotalPrice.toFixed(2)
      : (Number(screening.base_price) * seats.length).toFixed(2);
    const unitSeatPrice = (Number(totalPrice) / seats.length).toFixed(2);
    const bookingRef = createBookingReference();

    const { rows: bookingRows } = await client.query(
      `INSERT INTO bookings (booking_ref, customer_name, customer_email, screening_id, total_price, payment_status, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, booking_ref, customer_name, customer_email,
                 screening_id, total_price, status, payment_status, transaction_id, created_at`,
      [bookingRef, customerName, customerEmail, screening.id, totalPrice, paymentStatus, transactionId]
    );
    booking = bookingRows[0];

    for (const seat of seats) {
      await client.query(
        'INSERT INTO booking_seats (booking_id, screening_id, seat_label, price) VALUES ($1, $2, $3, $4)',
        [booking.id, screening.id, seat, unitSeatPrice]
      );
    }
    await client.query('COMMIT');
    transactionStarted = false;

    const responseBooking = {
      ...booking,
      movie_title: screening.movie_title,
      starts_at: screening.starts_at,
      auditorium: screening.auditorium,
      seats,
      total_price: Number(booking.total_price)
    };
    let emailStatus = 'sent';
    try {
      await sendBookingConfirmation(responseBooking);
    } catch (error) {
      console.error(`Booking email failed for ${booking.booking_ref}:`, error);
      emailStatus = process.env.SMTP_HOST ? 'failed' : 'not_configured';
    }

    return res.status(201).json({
      booking: responseBooking,
      emailStatus,
      message: emailStatus === 'sent'
        ? 'Booking confirmed. A confirmation email was sent.'
        : 'Booking confirmed, but the confirmation email could not be sent.'
    });
  } catch (error) {
    if (transactionStarted) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('Booking rollback failed:', rollbackError);
      }
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function retrieveBooking(req, res) {
  await ensureBookingSchema();
  const reference = String(req.params.reference || '').trim().toUpperCase();
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) throw httpError(400, 'The booking email address is required for verification.');
  const { rows } = await pool.query(
    `SELECT b.booking_ref, b.customer_name, b.customer_email, b.total_price, b.status,
            b.payment_status, b.transaction_id,
            b.created_at, m.title AS movie_title, s.starts_at, a.name AS auditorium,
            COALESCE(array_agg(bs.seat_label ORDER BY bs.seat_label)
              FILTER (WHERE bs.seat_label IS NOT NULL), '{}') AS seats
     FROM bookings b
     JOIN screenings s ON s.id = b.screening_id
     JOIN movies m ON m.id = s.movie_id
     JOIN auditoriums a ON a.id = s.auditorium_id
     LEFT JOIN booking_seats bs ON bs.booking_id = b.id
     WHERE b.booking_ref = $1 AND lower(b.customer_email) = $2
     GROUP BY b.id, m.title, s.starts_at, a.name`,
    [reference, email]
  );
  if (!rows[0]) throw httpError(404, 'No booking matched that reference and email.');
  res.json(rows[0]);
}
