const db = require("../config/db");

/**
 * Ambil atau buat cart user
 */
const getOrCreateCart = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM carts WHERE user_id = ?",
    [userId]
  );

  if (rows.length > 0) return rows[0];

  const [result] = await db.query(
    "INSERT INTO carts (user_id) VALUES (?)",
    [userId]
  );

  return { id: result.insertId, user_id: userId };
};

/**
 * GET Cart User
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getOrCreateCart(userId);

    const [items] = await db.query(
      `
      SELECT 
        ci.id,
        ci.quantity,
        ci.note,
        p.id AS product_id,
        p.name,
        p.description,
        p.price,
        p.image_url
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.cart_id = ?
      `,
      [cart.id]
    );

    res.json({ cartId: cart.id, items });
  } catch (err) {
    console.error("GET CART ERROR:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Gagal mengambil cart" });
  }
};

/**
 * ADD ke Cart (FIXED)
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1, note } = req.body;

    if (!product_id) {
      return res.status(400).json({ message: "product_id wajib diisi" });
    }

    const cart = await getOrCreateCart(userId);

    // 🔍 cek apakah produk sudah ada di cart
    const [[existing]] = await db.query(
      `
      SELECT * FROM cart_items
      WHERE cart_id = ? AND product_id = ?
      `,
      [cart.id, product_id]
    );

    if (existing) {
      // UPDATE qty
      await db.query(
        `
        UPDATE cart_items
        SET quantity = quantity + ?, note = ?
        WHERE id = ?
        `,
        [quantity, note || existing.note, existing.id]
      );
    } else {
      // INSERT baru
      await db.query(
        `
        INSERT INTO cart_items (cart_id, product_id, quantity, note)
        VALUES (?, ?, ?, ?)
        `,
        [cart.id, product_id, quantity, note || null]
      );
    }

    res.json({ message: "Produk berhasil ditambahkan ke cart" });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Gagal menambah cart" });
  }
};

/**
 * UPDATE quantity
 */
exports.updateCartItem = async (req, res) => {
  try {
    const { item_id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity minimal 1" });
    }

    await db.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [quantity, item_id]
    );

    res.json({ message: "Cart diperbarui" });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Gagal update cart" });
  }
};

/**
 * DELETE item cart
 */
exports.removeCartItem = async (req, res) => {
  try {
    const { item_id } = req.params;

    await db.query(
      "DELETE FROM cart_items WHERE id = ?",
      [item_id]
    );

    res.json({ message: "Item dihapus dari cart" });
  } catch (err) {
    console.error("DELETE CART ERROR:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Gagal hapus item" });
  }
};
