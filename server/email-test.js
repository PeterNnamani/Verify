import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env') });

async function testEmail() {
  // Create test SMTP transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // First verify the configuration
    await transporter.verify();
    console.log('SMTP connection successful');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'peternnamani001@gmail.com',
      subject: 'Test Email - Registration System',
      text: 'This is a test email from your registration system.',
      html: `
        <h2>Test Email - Registration System</h2>
        <p>This is a test email to verify the email sending functionality.</p>
        <p>If you receive this, the email system is working correctly.</p>
      `
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();
