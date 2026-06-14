const express = require("express");
const router = express.Router();
const uploadAsset = require("../middlewares/uploadAsset");
const pembangunanController = require("../controllers/pembangunanController");

router.get("/", pembangunanController.getAllPembangunans);
router.get("/:id", pembangunanController.getPembangunanById);

router.post(
  "/",
  (req, res, next) => {
    uploadAsset.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message || "UPLOAD_ERROR",
        });
      }
      next();
    });
  },
  pembangunanController.createPembangunan
);

router.put(
  "/:id",
  (req, res, next) => {
    uploadAsset.single("image")(req, res, function (err) {
      if (err) {
        return res.status(400).json({
          message: err.message || "UPLOAD_ERROR",
        });
      }
      next();
    });
  },
  pembangunanController.updatePembangunan
);

router.delete("/:id", pembangunanController.deletePembangunan);

module.exports = router;
