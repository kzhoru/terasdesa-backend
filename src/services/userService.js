const userRepo = require("../repositories/userRepository");

const getProfile = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) throw new Error("User tidak ditemukan");
  return user;
};

const updateProfile = async (userId, data) => {
  if (!data.name || !data.no_hp) {
    throw new Error("Nama dan No HP wajib diisi");
  }

  await userRepo.updateProfile(userId, data);
  return await userRepo.findById(userId);
};

const updatePhoto = async (userId, photoPath) => {
  await userRepo.updatePhoto(userId, photoPath);
  return await userRepo.findById(userId);
  // // 3. Hapus foto lama (JIKA ADA)
  // if (user.photo) {
  //   print("woi")
  //   const oldPath = path.join(__dirname, "../../", user.photo);

  //   if (fs.existsSync(oldPath)) {
  //     print("eh")
  //     fs.unlinkSync(oldPath);
  //   }
  // }

  
};

module.exports = { getProfile, updateProfile, updatePhoto };