const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: "Register berhasil",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: "Login berhasil",
      data: user,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { register, login };