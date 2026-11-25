
import 'dotenv/config';
import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
    throw new Error('Email is not configured.');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  return transporter;
}

// Customer confirmation email
export async function sendBookingConfirmation(booking) {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: booking.customer_email,
    subject: `FlimHall booking confirmed: ${booking.booking_ref}`,
    text: [
      `Hello ${booking.customer_name},`,
      '',
      `Your booking ${booking.booking_ref} is confirmed.`,
      `Movie: ${booking.movie_title}`,
      `Screening: ${new Date(booking.starts_at).toLocaleString('en-FI', {
        timeZone: 'Europe/Helsinki'
      })}`,
      `Seats: ${booking.seats.join(', ')}`,
      `Total: €${Number(booking.total_price).toFixed(2)}`,
      '',
      'Keep your booking reference and email address to retrieve your booking.',
      '',
      'FlimHall Booking System'
    ].join('\n')
  });
}

// Administrator notification email
export async function sendBookingNotification(booking) {
  if (!process.env.BOOKING_ALERT_EMAIL) {
    console.warn('BOOKING_ALERT_EMAIL is not configured.');
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.BOOKING_ALERT_EMAIL,
    subject: `New Ticket Booking - ${booking.booking_ref}`,
    text: [
      'A new movie ticket booking has been confirmed.',
      '',
      `Booking reference: ${booking.booking_ref}`,
      `Customer: ${booking.customer_name}`,
      `Customer email: ${booking.customer_email}`,
      `Movie: ${booking.movie_title}`,
      `Screening: ${new Date(booking.starts_at).toLocaleString('en-FI', {
        timeZone: 'Europe/Helsinki'
      })}`,
      `Seats: ${booking.seats.join(', ')}`,
      `Total: €${Number(booking.total_price).toFixed(2)}`,
      '',
      'FlimHall Booking System'
    ].join('\n')
  });
}
