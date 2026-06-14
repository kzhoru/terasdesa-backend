const db = require('../config/db');

// 1. Ambil Semua Produk (Untuk Halaman Depan)
const getAllProducts = async () => {
    const query = `
        SELECT p.id, p.name, p.price, p.stock, p.image_url, 
               u.name as seller_name 
        FROM products p 
        JOIN users u ON p.user_id = u.id 
        ORDER BY p.created_at DESC
    `;
    const [rows] = await db.query(query);
    return rows;
};

// 2. Ambil Detail Produk berdasarkan ID
const getProductById = async (id) => {
    const query = `
        SELECT p.*, 
               u.name as seller_name, 
               u.email as seller_email, 
               u.photo as seller_photo
        FROM products p 
        JOIN users u ON p.user_id = u.id 
        WHERE p.id = ?
    `;
    
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// 3. Tambah Produk Baru
const createProduct = async (data, file) => {
    const { userId, name, description, price, stock } = data;
    
    // Simpan URL gambar (jika ada file diupload)
    const imageUrl = file ? `/uploads/products/${file.filename}` : null;

    const query = `
        INSERT INTO products (user_id, name, description, price, stock, image_url) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(query, [userId, name, description, price, stock, imageUrl]);
    
    // Kembalikan data produk yang baru dibuat
    return { 
        id: result.insertId, 
        userId, 
        name, 
        price, 
        imageUrl 
    };
};

// 4. Hapus Produk (Dengan Cek Pemilik)
const deleteProduct = async (productId, userId, userRole) => {
    // Cek dulu apakah produknya ada?
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (rows.length === 0) {
        throw new Error('Produk tidak ditemukan');
    }
    
    const product = rows[0];

    // Validasi Keamanan:
    // Hanya boleh dihapus oleh PEMILIK produk itu sendiri ATAU Admin
    if (product.user_id != userId && userRole !== 'admin') {
        throw new Error('Unauthorized'); // Error 403
    }

    // Jika lolos, baru hapus
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    return true;
};

module.exports = { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    deleteProduct 
};