const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdminOrLimitedAdmin');

// Public endpoints
router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);

// Protected endpoints
router.post('/', auth, requireAdminOrLimitedAdmin, bannerController.createBanner);
router.put('/:id', auth, requireAdminOrLimitedAdmin, bannerController.updateBanner);
router.delete('/:id', auth, requireAdminOrLimitedAdmin, bannerController.deleteBanner);

module.exports = router;
