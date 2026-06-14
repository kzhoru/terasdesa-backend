const db = require("../config/db");

const getAll = async () => {
  const [rows] = await db.query("SELECT * FROM pembangunan ORDER BY created_at DESC");
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM pembangunan WHERE id = ?", [id]);
  return rows[0];
};

const create = async (data) => {
  const { nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres, status, deskripsi, image_url } = data;
  const [result] = await db.query(
    `INSERT INTO pembangunan (nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres, status, deskripsi, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres || 0, status || 'Direncanakan', deskripsi, image_url]
  );
  return result.insertId;
};

const update = async (id, data) => {
  const { nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres, status, deskripsi, image_url } = data;
  const [result] = await db.query(
    `UPDATE pembangunan 
     SET nama_proyek = ?, anggaran = ?, sumber_dana = ?, tanggal_mulai = ?, target_selesai = ?, progres = ?, status = ?, deskripsi = ?, image_url = ?
     WHERE id = ?`,
    [nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres, status, deskripsi, image_url, id]
  );
  return result;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM pembangunan WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
