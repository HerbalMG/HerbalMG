const express = require('express');
const router = express.Router();
const controller = require('../controllers/subCategoryController');
const auth = require('../middleware/auth');

function requireAdminOrLimitedAdmin(req, res, next) {
  if (!req.user || !['admin', 'limited_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
}

// Routes
router.get('/', controller.getAll);
router.get('/:identifier', controller.getByIdOrSlug);
router.post('/', auth, requireAdminOrLimitedAdmin, controller.create);
router.put('/:identifier', auth, requireAdminOrLimitedAdmin, controller.update);
router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, controller.remove);

module.exports = router;
