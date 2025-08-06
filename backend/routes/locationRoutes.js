const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');

router.post('/detect-location', locationController.detectLocation);
router.get('/pincodes/:query', locationController.searchPincodes);

module.exports = router;
