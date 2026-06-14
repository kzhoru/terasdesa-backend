const pembangunanService = require("../services/pembangunanService");

const getAllPembangunans = async (req, res) => {
  try {
    const pembangunans = await pembangunanService.getPembangunans();
    res.json(pembangunans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

const getPembangunanById = async (req, res) => {
  try {
    const proyek = await pembangunanService.getPembangunanById(req.params.id);
    res.json(proyek);
  } catch (err) {
    if (err.message === "PROYEK_NOT_FOUND") {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

const createPembangunan = async (req, res) => {
  try {
    const { nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres, status, deskripsi } = req.body;

    if (!nama_proyek || !anggaran || !sumber_dana || !tanggal_mulai || !target_selesai) {
      return res.status(400).json({ message: "INVALID_DATA" });
    }

    const image_url = req.file ? `/uploads/assets/${req.file.filename}` : req.body.image_url || null;

    const data = {
      nama_proyek,
      anggaran,
      sumber_dana,
      tanggal_mulai,
      target_selesai,
      progres: parseInt(progres) || 0,
      status,
      deskripsi,
      image_url,
    };

    const id = await pembangunanService.createPembangunan(data);

    res.status(201).json({
      message: "Proyek pembangunan berhasil ditambahkan",
      id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

const updatePembangunan = async (req, res) => {
  try {
    const proyekLama = await pembangunanService.getPembangunanById(req.params.id);
    if (!proyekLama) {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }

    const { nama_proyek, anggaran, sumber_dana, tanggal_mulai, target_selesai, progres, status, deskripsi } = req.body;

    if (!nama_proyek || !anggaran || !sumber_dana || !tanggal_mulai || !target_selesai) {
      return res.status(400).json({ message: "INVALID_DATA" });
    }

    const image_url = req.file ? `/uploads/assets/${req.file.filename}` : proyekLama.image_url;

    const data = {
      nama_proyek,
      anggaran,
      sumber_dana,
      tanggal_mulai,
      target_selesai,
      progres: parseInt(progres) || 0,
      status,
      deskripsi,
      image_url,
    };

    await pembangunanService.updatePembangunan(req.params.id, data);

    res.json({ message: "Proyek pembangunan berhasil diperbarui" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

const deletePembangunan = async (req, res) => {
  try {
    await pembangunanService.deletePembangunan(req.params.id);
    res.json({ message: "Proyek pembangunan berhasil dihapus" });
  } catch (err) {
    if (err.message === "PROYEK_NOT_FOUND") {
      return res.status(404).json({ message: "Proyek tidak ditemukan" });
    }
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

module.exports = {
  getAllPembangunans,
  getPembangunanById,
  createPembangunan,
  updatePembangunan,
  deletePembangunan,
};
