const db = require("../config/db");

// ===============================
// CHECKOUT CART (FIXED)
// ===============================
exports.checkout = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const userId = req.user.id;

    await connection.beginTransaction();

    // Ambil cart user
    const [[cart]] = await connection.query(
      "SELECT * FROM carts WHERE user_id = ?",
      [userId]
    );

    if (!cart) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart kosong" });
    }

    // Ambil item cart
    const [items] = await connection.query(
      `
      SELECT 
        ci.quantity,
        ci.note,
        p.id AS product_id,
        p.price,
        p.stock
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ?
      `,
      [cart.id]
    );

    if (items.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart kosong" });
    }

    // Hitung total & validasi stok
    let total = 0;
    for (const item of items) {
      if (item.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          message: "Stok produk tidak mencukupi",
        });
      }
      total += item.price * item.quantity;
    }

    // Simpan transaksi
    const [result] = await connection.query(
      "INSERT INTO transaksi (user_id, total, status) VALUES (?, ?, 'paid')",
      [userId, total]
    );

    const transaksiId = result.insertId;

    // Simpan item transaksi + update stok
    for (const item of items) {
      await connection.query(
        `
        INSERT INTO transaksi_items 
        (transaksi_id, product_id, price, quantity, note)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          transaksiId,
          item.product_id,
          item.price,
          item.quantity,
          item.note,
        ]
      );

      await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.product_id]
      );
    }

    // Kosongkan cart
    await connection.query(
      "DELETE FROM cart_items WHERE cart_id = ?",
      [cart.id]
    );

    await connection.commit();

    res.json({
      message: "Checkout berhasil",
      transaksi_id: transaksiId,
      total,
    });
  } catch (err) {
    await connection.rollback();
    console.error(err); // penting untuk debugging
    res.status(500).json({ message: "Checkout gagal" });
  } finally {
    connection.release();
  }
};
