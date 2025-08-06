const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdminOrLimitedAdmin');
const referenceBookController = require('../controllers/referenceBookController');

// Public
router.get('/', referenceBookController.getAll);
router.get('/:id', referenceBookController.getById);

// Protected
router.post('/', auth, requireAdminOrLimitedAdmin, referenceBookController.create);
router.put('/:id', auth, requireAdminOrLimitedAdmin, referenceBookController.update);
router.delete('/:id', auth, requireAdminOrLimitedAdmin, referenceBookController.remove);

module.exports = router;
