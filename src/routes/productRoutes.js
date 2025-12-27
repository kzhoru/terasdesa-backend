const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadProduct = require('../middlewares/uploadProduct');
const verifyToken = require('../middlewares/authMiddleware'); 

// --- BAGIAN PENTING (Rute Utama) ---
router.get('/', productController.getAllProducts); 
// -----------------------------------

router.get('/:id', productController.getProductById);
router.post("/", verifyToken, uploadProduct.single('image'), productController.createProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;