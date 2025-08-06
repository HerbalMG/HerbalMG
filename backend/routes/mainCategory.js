const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdmin');

const {
  getAllMainCategories,
  getMainCategoryByIdOrSlug,
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
} = require('../controllers/mainCategoryController');

// Public routes
router.get('/', getAllMainCategories);
router.get('/:identifier', getMainCategoryByIdOrSlug);

// Protected routes
router.post('/', auth, requireAdminOrLimitedAdmin, createMainCategory);
router.put('/:identifier', auth, requireAdminOrLimitedAdmin, updateMainCategory);
router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, deleteMainCategory);

module.exports = router;
