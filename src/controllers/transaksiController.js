const db = require("../config/db");


// ===============================
// GET RIWAYAT TRANSAKSI (USER)
// ===============================
exports.getMyTransaksi = async (req, res) => {
  try {
    const userId = req.user.id;

    const [transaksi] = await db.query(
      `
      SELECT 
        t.id,
        t.total,
        t.status,
        t.created_at
      FROM transaksi t
      WHERE t.user_id = ?
      ORDER BY t.created_at DESC
      `,
      [userId]
    );

    res.json(transaksi);
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil transaksi" });
  }
};

// ===============================
// GET DETAIL TRANSAKSI
// ===============================
exports.getDetailTransaksi = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Ambil transaksi
    const [[transaksi]] = await db.query(
      `
      SELECT * FROM transaksi
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (!transaksi) {
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });
    }

    // Ambil item transaksi
    const [items] = await db.query(
      `
      SELECT 
        ti.id,
        ti.quantity,
        ti.price,
        ti.note,
        p.name,
        p.image_url
      FROM transaksi_items ti
      JOIN products p ON p.id = ti.product_id
      WHERE ti.transaksi_id = ?
      `,
      [id]
    );

    res.json({
      transaksi,
      items,
    });
  } catch (err) {
    res.status(500).json({ message: "Gagal mengambil detail transaksi" });
  }
};
