const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbName = process.env.DB_NAME || 'personal_web';
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || ''
    }
});

// Flag to track database connection state
let isDbConnected = false;
const inMemoryDb = []; // Fallback storage for test mode when MySQL is offline

// Connect to MySQL server first to make sure DB exists
const db = mysql.createConnection(dbConfig);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        console.error('Please make sure MySQL is running and credentials in .env are correct.');
        console.log('FALLBACK: Starting in-memory mockup database mode for demonstration.');
        return;
    }
    console.log('Connected to MySQL server.');
    isDbConnected = true;

    // Create database if it doesn't exist
    db.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
        if (err) {
            console.error('Error creating database:', err.message);
            isDbConnected = false;
            return;
        }
        console.log(`Database "${dbName}" is ready.`);

        // Select the database
        db.query(`USE \`${dbName}\``, (err) => {
            if (err) {
                console.error('Error switching database:', err.message);
                isDbConnected = false;
                return;
            }

            // Create table if it doesn't exist (with is_verified & otp_code)
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS messages (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    message TEXT NOT NULL,
                    otp_code VARCHAR(6) DEFAULT NULL,
                    is_verified TINYINT(1) DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
            db.query(createTableQuery, (err) => {
                if (err) {
                    console.error('Error creating table:', err.message);
                    isDbConnected = false;
                } else {
                    console.log('Table "messages" is ready.');

                    // Safety: Add columns if table already existed without them
                    db.query(`SHOW COLUMNS FROM messages LIKE 'otp_code'`, (err, results) => {
                        if (!err && results.length === 0) {
                            db.query(`ALTER TABLE messages ADD COLUMN otp_code VARCHAR(6) DEFAULT NULL`, (err) => {
                                if (err) console.error('Error adding otp_code column:', err.message);
                                else console.log('Added column "otp_code" to messages table.');
                            });
                        }
                    });
                    db.query(`SHOW COLUMNS FROM messages LIKE 'is_verified'`, (err, results) => {
                        if (!err && results.length === 0) {
                            db.query(`ALTER TABLE messages ADD COLUMN is_verified TINYINT(1) DEFAULT 0`, (err) => {
                                if (err) console.error('Error adding is_verified column:', err.message);
                                else console.log('Added column "is_verified" to messages table.');
                            });
                        }
                    });
                }
            });
        });
    });
});

// POST endpoint to handle form submission (generates and sends OTP)
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Generate a 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Fallback: If DB is not connected, use in-memory DB
    if (!isDbConnected) {
        const messageId = inMemoryDb.length + 1;
        inMemoryDb.push({
            id: messageId,
            name,
            email,
            message,
            otp_code: otpCode,
            is_verified: 0,
            created_at: new Date()
        });

        console.log(`[Pending Message (In-Memory)] ID: ${messageId}, Email: ${email}, OTP: ${otpCode}`);
        console.warn('\n======================================================');
        console.warn(`[TEST MODE - NO MYSQL] DB OFFLINE`);
        console.warn(`OTP Code for ${email} is: ${otpCode}`);
        console.warn('======================================================\n');

        return res.status(200).json({
            success: true,
            message: 'OTP generated (In-Memory Fallback). Check server terminal for OTP.',
            id: messageId,
            testMode: true
        });
    }

    // Standard flow (DB connected): Insert message as unverified
    const insertQuery = 'INSERT INTO messages (name, email, message, otp_code, is_verified) VALUES (?, ?, ?, ?, 0)';
    db.query(insertQuery, [name, email, message, otpCode], (err, result) => {
        if (err) {
            console.error('Error inserting message into database:', err.message);
            return res.status(500).json({ success: false, error: 'Failed to create contact submission.' });
        }

        const messageId = result.insertId;
        console.log(`[Pending Message] ID: ${messageId}, Email: ${email}, OTP: ${otpCode}`);

        // Fallback for development/testing if SMTP settings are not configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('\n======================================================');
            console.warn(`[TEST MODE] EMAIL NOT CONFIGURED IN .env`);
            console.warn(`OTP Code for ${email} is: ${otpCode}`);
            console.warn('======================================================\n');
            return res.status(200).json({
                success: true,
                message: 'OTP generated (Test Mode). Check backend terminal for the code.',
                id: messageId,
                testMode: true
            });
        }

        // Send OTP via email using nodemailer
        const mailOptions = {
            from: `"Vincent Portfolio" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify Your Message Submission - Vincent Portfolio',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; background-color: #f9fafb; color: #1f2937; max-width: 600px; margin: 0 auto; border-radius: 8px; border: 1px solid #e5e7eb;">
                    <h2 style="color: #4f46e5; margin-bottom: 20px; font-weight: 700;">Email Verification Required</h2>
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>Thank you for reaching out to me! To verify that this email is yours and send your message, please enter the verification code below on the website:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 5px; padding: 15px 30px; background-color: #e0e7ff; text-align: center; border-radius: 6px; margin: 25px 0; color: #4f46e5; border: 1px solid #c7d2fe; display: inline-block; width: calc(100% - 60px);">
                        ${otpCode}
                    </div>
                    <p>If you did not initiate this request, you can safely ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 25px 0;">
                    <p style="font-size: 12px; color: #9ca3af; text-align: center;">This is an automated email from Vincent's Portfolio website.</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                console.warn(`OTP fallback code printed to console: ${otpCode}`);
                return res.status(200).json({
                    success: true,
                    message: 'Saved, email sending failed. Check server console for OTP.',
                    id: messageId,
                    testMode: true
                });
            }
            console.log(`Verification email sent to ${email}. Message ID: ${info.messageId}`);
            res.status(200).json({
                success: true,
                message: 'Verification email sent.',
                id: messageId,
                testMode: false
            });
        });
    });
});

// POST endpoint to verify OTP code
app.post('/api/contact/verify', (req, res) => {
    const { id, otpCode } = req.body;

    if (!id || !otpCode) {
        return res.status(400).json({ success: false, error: 'Message ID and OTP code are required.' });
    }

    // Fallback: If DB is not connected, use in-memory DB
    if (!isDbConnected) {
        const message = inMemoryDb.find(m => m.id === parseInt(id));

        if (!message) {
            return res.status(404).json({ success: false, error: 'Message record not found.' });
        }

        if (message.is_verified === 1) {
            return res.status(400).json({ success: false, error: 'Message is already verified.' });
        }

        if (message.otp_code !== otpCode) {
            return res.status(400).json({ success: false, error: 'Invalid verification code.' });
        }

        message.is_verified = 1;
        message.otp_code = null;
        console.log(`[Verified Message (In-Memory)] ID: ${id} verified successfully!`);
        return res.status(200).json({ success: true, message: 'Message verified and saved successfully!' });
    }

    // Standard flow (DB connected): Check message in database
    const query = 'SELECT * FROM messages WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error verifying message:', err.message);
            return res.status(500).json({ success: false, error: 'Database verification check failed.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, error: 'Message record not found.' });
        }

        const message = results[0];

        if (message.is_verified === 1) {
            return res.status(400).json({ success: false, error: 'Message is already verified.' });
        }

        if (message.otp_code !== otpCode) {
            return res.status(400).json({ success: false, error: 'Invalid verification code. Please check your OTP.' });
        }

        // Success! Set verified and clear OTP code
        const updateQuery = 'UPDATE messages SET is_verified = 1, otp_code = NULL WHERE id = ?';
        db.query(updateQuery, [id], (err, result) => {
            if (err) {
                console.error('Error updating status:', err.message);
                return res.status(500).json({ success: false, error: 'Failed to finalize verification.' });
            }
            console.log(`[Verified Message] ID: ${id} verified successfully!`);
            res.status(200).json({ success: true, message: 'Message verified and saved successfully!' });
        });
    });
});

// GET endpoint to view messages (shows only verified messages by default)
app.get('/api/contact', (req, res) => {
    const showAll = req.query.all === 'true';
    if (!isDbConnected) {
        const filtered = showAll
            ? inMemoryDb
            : inMemoryDb.filter(m => m.is_verified === 1);
        return res.status(200).json({ success: true, data: filtered });
    }

    const query = showAll
        ? 'SELECT * FROM messages ORDER BY created_at DESC'
        : 'SELECT id, name, email, message, created_at FROM messages WHERE is_verified = 1 ORDER BY created_at DESC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching messages:', err.message);
            return res.status(500).json({ success: false, error: 'Failed to fetch messages.' });
        }
        res.status(200).json({ success: true, data: results });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Submit endpoint: http://localhost:${PORT}/api/contact`);
    console.log(`Verify endpoint: http://localhost:${PORT}/api/contact/verify`);
});
