const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdminOrLimitedAdmin');
const brandController = require('../controllers/brandController');

// Public
router.get('/', brandController.getAll);
router.get('/top', brandController.getTopBrands);
router.get('/:identifier', brandController.getByIdentifier);

// Protected
router.post('/', auth, requireAdminOrLimitedAdmin, brandController.create);
router.put('/:identifier', auth, requireAdminOrLimitedAdmin, brandController.update);
router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, brandController.remove);

module.exports = router;
