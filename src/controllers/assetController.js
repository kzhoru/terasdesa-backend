const assetService = require("../services/assetService");

// get all
const getAllAssets = async (req, res) => {
  try {
    const assets = await assetService.getAssets();
    res.json(assets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

// get by ID
const getAssetById = async (req, res) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    res.json(asset);
  } catch (err) {
    if (err.message === "ASSET_NOT_FOUND") {
      return res.status(404).json({ message: "Asset tidak ditemukan" });
    }
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

// create
const createAsset = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { nama, lokasi, status, deskripsi } = req.body;

    if (!nama || !lokasi || !status) {
      return res.status(400).json({ message: "INVALID_DATA" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "IMAGE_REQUIRED" });
    }

    const data = {
      nama,
      lokasi,
      status,
      gambar_url: req.file.filename,
      deskripsi,
    };

    const id = await assetService.createAsset(data);

    res.status(201).json({
      message: "Asset berhasil ditambahkan",
      id,
    });
  } catch (err) {
    console.error("CREATE ASSET ERROR:", err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

// update
const updateAsset = async (req, res) => {
  try {
    const assetLama = await assetService.getAssetById(req.params.id);

    if (!assetLama) {
      return res.status(404).json({ message: "ASSET_NOT_FOUND" });
    }

    const data = {
      nama: req.body.nama,
      lokasi: req.body.lokasi,
      status: req.body.status,
      deskripsi: req.body.deskripsi,

      gambar_url: req.file
        ? req.file.filename
        : assetLama.gambar_url,
    };

    await assetService.updateAsset(req.params.id, data);

    res.json({ message: "Asset berhasil diperbarui" });
  } catch (err) {
    console.error("UPDATE ASSET ERROR:", err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};


// Delete
const deleteAsset = async (req, res) => {
  try {
    await assetService.deleteAsset(req.params.id);
    res.json({ message: "Asset berhasil dihapus" });
  } catch (err) {
    if (err.message === "ASSET_NOT_FOUND") {
      return res.status(404).json({ message: "Asset tidak ditemukan" });
    }
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
