const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const uploadProfile = require("../middlewares/uploadProfile");

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.put(
    "/profile/photo",
    authMiddleware,
    uploadProfile.single("photo"),
    userController.updatePhoto
);

module.exports = router;