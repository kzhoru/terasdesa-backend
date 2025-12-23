const userService = require("../services/userService");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.json({
      success: true,
      message: "Profile berhasil diupdate",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const updatePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File tidak ditemukan",
      });
    }

    const photoPath = `uploads/profile/${req.file.filename}`;

    const user = await userService.updatePhoto(req.user.id, photoPath);

    res.json({
      success: true,
      message: "Foto profile berhasil diupdate",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getProfile, updateProfile, updatePhoto };