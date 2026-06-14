const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const initDB = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        tanggal_lahir DATE NOT NULL,
        no_hp VARCHAR(15) NOT NULL,
        photo VARCHAR(255),
        role ENUM('admin','user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table users ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);
    console.log("Table products ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
          ON DELETE CASCADE
      )
    `);
    console.log("Table wishlist ready");

    await db.query(`

      CREATE TABLE IF NOT EXISTS assets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        lokasi VARCHAR(100) NOT NULL,
        status ENUM('Tersedia','Tidak Tersedia') NOT NULL,
        gambar_url VARCHAR(255),
        deskripsi TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table aset ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);
    console.log("Table carts ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES carts(id)
          ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    console.log("Table cart_items ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS transaksi (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        total DECIMAL(12,2) NOT NULL,
        status ENUM('pending','paid','cancelled')
          DEFAULT 'paid',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
      )
    `);
    console.log("Table transaksi ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS transaksi_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        transaksi_id INT NOT NULL,
        product_id INT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        note TEXT,
        FOREIGN KEY (transaksi_id) REFERENCES transaksi(id)
          ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);
    console.log("Table transaksi_items ready");

    await db.query(`
      CREATE TABLE IF NOT EXISTS pembangunan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_proyek VARCHAR(255) NOT NULL,
        anggaran DECIMAL(15,2) NOT NULL,
        sumber_dana VARCHAR(100) NOT NULL,
        tanggal_mulai DATE NOT NULL,
        target_selesai DATE NOT NULL,
        progres INT NOT NULL DEFAULT 0,
        status ENUM('Direncanakan', 'Berjalan', 'Selesai', 'Ditangguhkan') DEFAULT 'Direncanakan',
        deskripsi TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Table pembangunan ready");

  } catch (err) {
    console.error("DB init error:", err.message);
  }
};

initDB();
module.exports = db;
