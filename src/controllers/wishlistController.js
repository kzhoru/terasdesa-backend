const db = require('../config/db');

exports.store = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;
        
        // Cek jika sudah ada untuk menghindari duplikat
        const [exist] = await db.query("SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, product_id]);
        if (exist.length > 0) return res.status(400).json({ message: "Sudah ada di wishlist" });

        await db.query("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, product_id]);
        res.status(201).json({ success: true, message: 'Berhasil ditambah' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.destroy = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        await db.query("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, productId]);
        res.status(200).json({ success: true, message: 'Berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.index = async (req, res) => {
    try {
        const userId = req.user.id;
        const { stock } = req.query;
        
        let query = "SELECT p.* FROM products p JOIN wishlist w ON p.id = w.product_id WHERE w.user_id = ?";
        if (stock === 'available') query += " AND p.stock > 0";
        if (stock === 'empty') query += " AND p.stock = 0";

        const [rows] = await db.query(query, [userId]);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};