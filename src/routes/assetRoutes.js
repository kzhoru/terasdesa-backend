const express = require('express');
const router = express.Router();
const uploadAsset = require('../middlewares/uploadAsset');
const assetController = require('../controllers/assetController');

router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post(
  '/',
  (req, res, next) => {
    uploadAsset.single('image')(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message || 'UPLOAD_ERROR',
        });
      }
      next();
    });
  },
  assetController.createAsset
);
router.put(
  '/:id',
  (req, res, next) => {
    uploadAsset.single('gambar')(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message || 'UPLOAD_ERROR',
        });
      }
      next();
    });
  },
  assetController.updateAsset
);
router.delete('/:id', assetController.deleteAsset);

module.exports = router;
