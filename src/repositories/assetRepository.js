const db = require("../config/db");

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM assets");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM assets WHERE id = ?",
    [id]
  );
  return rows[0];
};

const create = async (data) => {
  const { nama, lokasi, status, gambar_url, deskripsi } = data;

  const [result] = await db.query(
    `INSERT INTO assets (nama, lokasi, status, gambar_url, deskripsi)
     VALUES (?, ?, ?, ?, ?)`,
    [nama, lokasi, status, gambar_url, deskripsi]
  );

  return result.insertId;
};

const update = async (id, data) => {
  const {
    nama,
    lokasi,
    status,
    deskripsi,
    gambar_url
  } = data;

  const [result] = await db.query(
    `
    UPDATE assets 
    SET 
      nama = ?, 
      lokasi = ?, 
      status = ?, 
      deskripsi = ?, 
      gambar_url = ?
    WHERE id = ?
    `,
    [
      nama,
      lokasi,
      status,
      deskripsi,
      gambar_url,
      id
    ]
  );

  return result;
};

const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM assets WHERE id = ?",
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
