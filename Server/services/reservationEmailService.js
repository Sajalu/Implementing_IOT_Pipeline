import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Destructure environment variables
const { EMAIL_USER, EMAIL_PASS } = process.env;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error('EMAIL_USER or EMAIL_PASS is missing from environment variables');
}

// Email transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Utility: Simple email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Utility: Escape HTML to avoid injection
const escape = (str) => {
  const safeStr = String(str || '');
  return safeStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Send confirmation email
export const sendConfirmationEmail = async (reservation) => {
  if (!isValidEmail(reservation.email)) throw new Error('Invalid email address');

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="color: #2c3e50;">Reservation Confirmed ✅</h2>
      <div style="background: #f0f0f0; padding: 16px; border-radius: 8px;">
        <p><strong>Name:</strong> ${escape(reservation.full_name)}</p>
        <p><strong>Check-in:</strong> ${escape(reservation.check_in)}</p>
        <p><strong>Check-out:</strong> ${escape(reservation.check_out)}</p>
      </div>
      <p style="margin-top: 16px;">Thank you for booking with us!</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Hotel Booking" <${EMAIL_USER}>`,
    to: reservation.email,
    subject: 'Booking Confirmation',
    html: htmlContent,
  });

  console.log(`✅ Confirmation email sent to ${reservation.email}`);
};

// Send cancellation email
export const sendCancellationEmail = async (email) => {
  if (!isValidEmail(email)) throw new Error('Invalid email address');

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px;">
      <h2 style="color: #e74c3c;">Booking Cancelled ❌</h2>
      <p>Your reservation has been successfully cancelled.</p>
      <p>If this was a mistake, please contact us to rebook.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Hotel Booking" <${EMAIL_USER}>`,
    to: email,
    subject: 'Booking Cancellation',
    html: htmlContent,
  });

  console.log(`❌ Cancellation email sent to ${email}`);
};
