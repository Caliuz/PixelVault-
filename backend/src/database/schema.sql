CREATE DATABASE IF NOT EXISTS pixelvault;
USE pixelvault;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  credits INT DEFAULT 1500,
  role ENUM('client', 'seller') DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  tag VARCHAR(50) NOT NULL,
  cr INT NOT NULL,
  brl DECIMAL(10, 2) NOT NULL,
  rating VARCHAR(10) DEFAULT '4.9',
  img VARCHAR(255) NOT NULL,
  seller_id INT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_cr INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  price_cr INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT IGNORE INTO products (id, title, category, platform, tag, cr, brl, rating, img) VALUES
(1, 'CyberPulse 2099', 'Jogo', 'PC / CLOUD', 'EM DESTAQUE', 420, 249.90, '4.9', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80'),
(2, 'Deriva Quântica', 'Jogo', 'PC / CORRIDA', 'LANÇAMENTO', 300, 179.90, '4.7', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80'),
(3, 'Neon Blade VR', 'Jogo', 'PC / VR', 'TOP AÇÃO', 240, 149.90, '4.8', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=700&q=80'),
(4, 'Neural Link Headset', 'Hardware', 'ÁUDIO 7.1', 'HARDWARE', 890, 549.90, '4.9', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80'),
(5, 'NeuroDeck Portátil', 'Hardware', 'CONSOLE', 'ED. LIMITADA', 2400, 1499.00, '5.0', 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=700&q=80'),
(6, 'Orbital Siege — Passe S7', 'Passe', 'PC / CLOUD', 'PASSE DE BATALHA', 120, 69.90, '4.6', 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=700&q=80');