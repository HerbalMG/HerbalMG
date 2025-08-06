const express = require('express');
const router = express.Router();
const controller = require('../controllers/productPriceController');
const auth = require('../middleware/auth');

// Middleware
function requireAdminOrLimitedAdmin(req, res, next) {
  if (!req.user || !['admin', 'limited_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
}

// Routes
router.get('/', controller.getAllPrices);
router.get('/:id', controller.getPriceById);
router.get('/product/:productId', controller.getPricesByProductId);
router.post('/', auth, requireAdminOrLimitedAdmin, controller.createMultiplePrices);
router.put('/:productId', auth, requireAdminOrLimitedAdmin, controller.updatePricesForProduct);
router.delete('/:id', controller.deletePriceById);

module.exports = router;
