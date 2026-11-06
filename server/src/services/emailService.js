import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
    throw new Error('Email is not configured. Set SMTP_HOST and SMTP_FROM.');
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD || '' }
        : undefined
    });
  }

  return transporter;
}

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
      `Screening: ${new Date(booking.starts_at).toLocaleString()}`,
      `Seats: ${booking.seats.join(', ')}`,
      `Total: $${Number(booking.total_price).toFixed(2)}`,
      '',
      'Keep your booking reference and email address to retrieve your booking.'
    ].join('\n')
  });
}
