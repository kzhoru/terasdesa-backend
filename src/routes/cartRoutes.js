const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../middlewares/auth");

router.get("/", auth, cartController.getCart);
router.post("/", auth, cartController.addToCart);
router.put("/:item_id", auth, cartController.updateCartItem);
router.delete("/:item_id", auth, cartController.removeCartItem);

module.exports = router;

