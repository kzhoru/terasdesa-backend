const multer = require("multer");
const path = require("path");
const fs = require("fs");

//memastikan folder ada
const uploadDir = path.join(__dirname, "../../uploads/assets");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : 'public'; 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `aset_${userId}_${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

//file filter
const fileFilter = (req, file, cb) => {
  const allowedMime = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("FORMAT_FILE_TIDAK_DIDUKUNG (jpg, jpeg, png, webp)"),
      false
    );
  }
};

//multer
const uploadAsset = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

module.exports = uploadAsset;
