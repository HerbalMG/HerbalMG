const express = require('express');
const router = express.Router();
const controller = require('../controllers/migrationController');

// Migration endpoints
router.post('/run', controller.runMigration);
router.post('/fix-slugs', controller.fixSlugs);
router.post('/test-maximum-discount', controller.testMaximumDiscount);
router.post('/set-people-preferred', controller.setPeoplePreferred);

// Test endpoint for linking products to main categories
const testController = require('../controllers/testController');
router.post('/link-product-main-category', testController.linkProductToMainCategory);

module.exports = router;