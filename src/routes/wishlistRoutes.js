const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);
router.get('/', wishlistController.index);
router.post('/', wishlistController.store);
router.delete('/:id', wishlistController.destroy);

module.exports = router;