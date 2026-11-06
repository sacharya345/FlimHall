import { randomBytes } from 'node:crypto';
import pool from '../db.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import { httpError, parseId } from '../utils/httpError.js';

function createBookingReference() {
  return `FH-${randomBytes(5).toString('hex').toUpperCase()}`;
}

export async function createBooking(req, res) {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const customerName = String(body.name || '').trim();
  const customerEmail = String(body.email || '').trim().toLowerCase();
  const screeningId = Number(body.screeningId);
  const seats = [...new Set((Array.isArray(body.seats) ? body.seats : [])
    .map((seat) => String(seat).trim().toUpperCase()))];
  if (!customerName || customerName.length > 120 || customerEmail.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw httpError(400, 'A name and valid email address are required.');
  }
  if (!Number.isSafeInteger(screeningId) || screeningId < 1 || seats.length === 0 || seats.length > 12
    || seats.some((seat) => !/^[A-Z]\d{1,2}$/.test(seat))) {
    throw httpError(400, 'Choose between 1 and 12 valid seats.');
  }

  const client = await pool.connect();
  let booking;
  let transactionStarted = false;
  try {
    await client.query('BEGIN');
    transactionStarted = true;
    const { rows } = await client.query(
      `SELECT s.id, s.starts_at, s.base_price, s.status, m.title AS movie_title,
              a.seat_rows, a.seat_columns
       FROM screenings s JOIN movies m ON m.id = s.movie_id
       JOIN auditoriums a ON a.id = s.auditorium_id
       WHERE s.id = $1 FOR UPDATE OF s`,
      [screeningId]
    );
    const screening = rows[0];
    if (!screening || screening.status !== 'scheduled' || new Date(screening.starts_at) <= new Date()) {
      throw httpError(409, 'This screening is no longer available.');
    }

    const validSeats = new Set();
    for (let row = 0; row < screening.seat_rows; row += 1) {
      for (let col = 1; col <= screening.seat_columns; col += 1) {
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
      [screeningId, seats]
    );
    if (occupiedRows.length) {
      throw httpError(409, `These seats are no longer available: ${occupiedRows.map((row) => row.seat_label).join(', ')}.`);
    }

    const totalPrice = (Number(screening.base_price) * seats.length).toFixed(2);
    const bookingRef = createBookingReference();
    const { rows: bookingRows } = await client.query(
      `INSERT INTO bookings (booking_ref, customer_name, customer_email, screening_id, total_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, booking_ref, customer_name, customer_email,
       screening_id, total_price, status, created_at`,
      [bookingRef, customerName, customerEmail, screeningId, totalPrice]
    );
    booking = bookingRows[0];
    for (const seat of seats) {
      await client.query(
        'INSERT INTO booking_seats (booking_id, screening_id, seat_label, price) VALUES ($1, $2, $3, $4)',
        [booking.id, screeningId, seat, screening.base_price]
      );
    }
    await client.query('COMMIT');
    transactionStarted = false;

    const responseBooking = {
      ...booking,
      movie_title: screening.movie_title,
      starts_at: screening.starts_at,
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
  const reference = String(req.params.reference || '').trim().toUpperCase();
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!email) throw httpError(400, 'The booking email address is required for verification.');
  const { rows } = await pool.query(
    `SELECT b.booking_ref, b.customer_name, b.customer_email, b.total_price, b.status,
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
