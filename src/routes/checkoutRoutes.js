const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const auth = require("../middlewares/auth"); // middleware lama kamu

router.post("/", auth, checkoutController.checkout);

module.exports = router;
