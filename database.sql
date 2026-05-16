CREATE DATABASE IF NOT EXISTS laroseeternelle
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE laroseeternelle;

CREATE TABLE IF NOT EXISTS orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(40) NOT NULL UNIQUE,
  product_name VARCHAR(160) NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(80) NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  customer_address TEXT NOT NULL,
  status ENUM('new', 'confirmed', 'delivered', 'cancelled') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  subject VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(180) NOT NULL UNIQUE,
  status ENUM('active', 'unsubscribed') NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
