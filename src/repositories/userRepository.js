const db = require("../config/db");

const findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0];
};

const create = async (data) => {
  const { name, email, password, tanggal_lahir, no_hp, role } = data;

  const [result] = await db.query(
    `INSERT INTO users
     (name, email, password, tanggal_lahir, no_hp, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email, password, tanggal_lahir, no_hp, role]
  );

  return result;
};

const findById = async (id) => {
  const [rows] = await db.query(
    "SELECT id, name, email, DATE_FORMAT(tanggal_lahir, '%Y-%m-%d') AS tanggal_lahir, no_hp, role, photo FROM users WHERE id = ?",
    [id]
  );
  return rows[0];
};

const updateProfile = async (id, data) => {
  const { name, no_hp } = data;

  const [result] = await db.query(
    "UPDATE users SET name = ?, no_hp = ? WHERE id = ?",
    [name, no_hp, id]
  );

  return result;
};

const updatePhoto = async (id, photo) => {
  const [result] = await db.query(
    "UPDATE users SET photo = ? WHERE id = ?",
    [photo, id]
  );
  return result;
};

module.exports = { findByEmail, create,findById, updateProfile, updatePhoto };