const db = require('../config/db'); // Pastikan path ini sesuai

// 1. GET ALL PRODUCTS (Untuk Halaman Depan & Fitur Pencarian)
exports.getAllProducts = async (req, res) => {
    try {
        // Ambil parameter search dari query string (?search=...)
        const { search } = req.query; 
        
        let query = 'SELECT * FROM products';
        let params = [];

        // Logika Pencarian: Jika parameter search ada dan tidak kosong
        if (search && search.trim() !== "") {
            query += ' WHERE name LIKE ?';
            params.push(`%${search}%`); // Menggunakan LIKE untuk pencarian fleksibel
        }

        query += ' ORDER BY id DESC';

        const [rows] = await db.query(query, params);
        
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error getAllProducts:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. GET DETAIL PRODUCT (Untuk Halaman Detail - Ada JOIN user)
exports.getProductById = async (req, res) => {
    try {
        // JOIN ke tabel users untuk ambil nama penjual
        const query = `
            SELECT p.*, u.name as seller_name 
            FROM products p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?
        `;
        
        const [rows] = await db.query(query, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error("Error getProductById:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. CREATE PRODUCT (Untuk Menjual Barang)
exports.createProduct = async (req, res) => {
    try {
        // Ambil data dari body (form)
        const { name, description, price, stock } = req.body;
        
        // Ambil ID User dari Token (Middleware authMiddleware)
        const userId = req.user.id; 
        
        // Cek Gambar Upload
        let imageUrl = null;
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        // Query Insert
        const query = `INSERT INTO products (user_id, name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)`;
        
        await db.query(query, [userId, name, description, price, stock, imageUrl]);

        res.status(201).json({
            success: true,
            message: 'Produk berhasil disimpan'
        });

    } catch (error) {
        console.error("Error createProduct:", error);
        res.status(500).json({ message: 'Gagal menyimpan produk' });
    }
};

// 4. DELETE PRODUCT (Untuk Menghapus Barang)
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id; // ID User yang mau menghapus

        console.log(`[DELETE REQUEST] Product ID: ${productId}, User ID: ${userId}`);

        // A. Cek apakah produk ada?
        const [check] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        
        if (check.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        // B. Cek apakah yang menghapus adalah pemilik?
        if (String(check[0].user_id) !== String(userId)) {
            console.log(`DITOLAK: Pemilik Asli ${check[0].user_id} vs Penipu ${userId}`);
            return res.status(403).json({ message: 'Anda bukan pemilik produk ini!' });
        }

        // C. Hapus Data
        await db.query('DELETE FROM products WHERE id = ?', [productId]);
        
        console.log("BERHASIL MENGHAPUS DATA");
        res.status(200).json({ success: true, message: 'Produk berhasil dihapus' });

    } catch (error) {
        console.error("ERROR HAPUS:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};