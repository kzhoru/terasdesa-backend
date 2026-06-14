const assetRepo = require("../repositories/assetRepository");

const getAssets = async () => {
  return await assetRepo.getAll();
};

const getAssetById = async (id) => {
  const asset = await assetRepo.getById(id);
  if (!asset) {
    throw new Error("ASSET_NOT_FOUND");
  }
  return asset;
};

const createAsset = async (data) => {
  if (!data.nama || !data.lokasi || !data.status) {
    throw new Error("INVALID_DATA");
  }
  return await assetRepo.create(data);
};

const updateAsset = async (id, data) => {
  const affected = await assetRepo.update(id, data);
  if (affected === 0) {
    throw new Error("ASSET_NOT_FOUND");
  }
};

const deleteAsset = async (id) => {
  const affected = await assetRepo.remove(id);
  if (affected === 0) {
    throw new Error("ASSET_NOT_FOUND");
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
