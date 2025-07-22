import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

require('dotenv').config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to verify reCAPTCHA token
app.post('/verify-captcha', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    console.log('Verifying token...');
    
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token
    });

    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const data = await response.json();
    console.log('Google reCAPTCHA response:', data);

    if (data.success) {
      console.log('Verification successful');
      res.json({ success: true, message: 'Verification successful' });
    } else {
      console.log('Verification failed:', data['error-codes']);
      res.json({ 
        success: false, 
        message: 'Verification failed', 
        errors: data['error-codes'],
        details: data 
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});