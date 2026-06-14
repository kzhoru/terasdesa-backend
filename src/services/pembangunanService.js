const pembangunanRepo = require("../repositories/pembangunanRepository");

const getPembangunans = async () => {
  return await pembangunanRepo.getAll();
};

const getPembangunanById = async (id) => {
  const proyek = await pembangunanRepo.getById(id);
  if (!proyek) {
    throw new Error("PROYEK_NOT_FOUND");
  }
  return proyek;
};

const createPembangunan = async (data) => {
  if (!data.nama_proyek || !data.anggaran || !data.sumber_dana || !data.tanggal_mulai || !data.target_selesai) {
    throw new Error("INVALID_DATA");
  }
  return await pembangunanRepo.create(data);
};

const updatePembangunan = async (id, data) => {
  if (!data.nama_proyek || !data.anggaran || !data.sumber_dana || !data.tanggal_mulai || !data.target_selesai) {
    throw new Error("INVALID_DATA");
  }
  const result = await pembangunanRepo.update(id, data);
  if (result.affectedRows === 0) {
    throw new Error("PROYEK_NOT_FOUND");
  }
};

const deletePembangunan = async (id) => {
  const affected = await pembangunanRepo.remove(id);
  if (affected === 0) {
    throw new Error("PROYEK_NOT_FOUND");
  }
};

module.exports = {
  getPembangunans,
  getPembangunanById,
  createPembangunan,
  updatePembangunan,
  deletePembangunan,
};
