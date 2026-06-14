const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");
const auth = require("../middlewares/auth");

// TRANSAKSI
router.get("/", auth, transaksiController.getMyTransaksi);
router.get("/:id", auth, transaksiController.getDetailTransaksi);

module.exports = router;
