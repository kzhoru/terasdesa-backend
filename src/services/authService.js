const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/userRepository");

const register = async (data) => {
  const { name, email, password, tanggal_lahir, no_hp } = data;

  if (!name || !email || !password || !tanggal_lahir || !no_hp) {
    throw new Error("Semua field wajib diisi");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter");
  }

  const existingUser = await userRepo.findByEmail(email);
  if (existingUser) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await userRepo.create({
    name,
    email,
    password: hashedPassword,
    tanggal_lahir,
    no_hp,
    role: "user",
  });

  const token = jwt.sign(
    { id: result.insertId, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { id: result.insertId, name, email, token };
};

const login = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new Error("Email dan password wajib diisi");
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error("Email tidak ditemukan");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Password salah");
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tanggal_lahir : user.tanggal_lahir,
    no_hp : user.no_hp,
    photo : user.photo,
    token,
  };
};

module.exports = { register, login };