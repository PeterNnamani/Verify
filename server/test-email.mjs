import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

async function testEmail() {
  console.log('Starting email test...');
  console.log('Using email:', process.env.EMAIL_USER);

  try {
    // Create test account
    console.log('Creating test transporter...');
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: true
    });

    // Verify connection
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'peternnamani001@gmail.com',
      subject: 'Test Email - Registration System',
      text: 'This is a test email to verify the email sending functionality.',
      html: `
        <h2>Test Email - Registration System</h2>
        <p>This is a test email sent at: ${new Date().toLocaleString()}</p>
        <p>If you receive this, the email system is working correctly.</p>
      `
    });

    console.log('Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error during email test:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    console.error('Stack trace:', error.stack);
  }
}

testEmail();
