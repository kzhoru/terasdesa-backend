const db = require('../config/db');

class WishlistService {
    async addToWishlist(userId, productId) {
        // Konversi ke Integer untuk keamanan
        const uId = parseInt(userId);
        const pId = parseInt(productId);

        // 1. Cek apakah produk benar-benar ada di tabel products
        const [productCheck] = await db.query("SELECT id FROM products WHERE id = ?", [pId]);
        if (productCheck.length === 0) {
            throw new Error('Produk tidak ditemukan di database');
        }

        // 2. Cek duplikasi di wishlist
        const [exist] = await db.query(
            "SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", 
            [uId, pId]
        );

        if (exist.length > 0) {
            throw new Error('Produk sudah ada di daftar wishlist Anda');
        }

        // 3. Eksekusi Insert ke Tabel
        const [result] = await db.query(
            "INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", 
            [uId, pId]
        );
        
        return result;
    }

    async getWishlistByUser(userId, stockFilter) {
        let query = `
            SELECT w.id as wishlist_id, p.* FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
        `;
        let params = [parseInt(userId)];

        if (stockFilter === 'available') {
            query += " AND p.stock > 0";
        } else if (stockFilter === 'empty') {
            query += " AND p.stock = 0";
        }

        query += " ORDER BY w.created_at DESC";
        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = new WishlistService();