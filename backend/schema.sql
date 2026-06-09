-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS personal_web;

USE personal_web;

-- Buat tabel messages jika belum ada
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    otp_code VARCHAR(6) DEFAULT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
