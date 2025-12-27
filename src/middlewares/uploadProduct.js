const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder tersedia
const uploadDir = path.join(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Format nama file: product_USERID_TIMESTAMP.jpg
        const userId = req.user ? req.user.id : 'unknown'; 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `product_${userId}_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung! Hanya jpg, jpeg, png.'), false);
    }
};

const uploadProduct = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5MB
    fileFilter: fileFilter
});

module.exports = uploadProduct;