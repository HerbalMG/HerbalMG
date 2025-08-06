const express = require('express');
const router = express.Router();
const controller = require('../controllers/productDiseaseController');

// Public routes
router.get('/product/:productId/diseases', controller.getProductDiseases);
router.get('/disease/:diseaseId/products', controller.getDiseaseProducts);

// For testing - make these public temporarily
router.post('/', controller.addDiseaseToProduct);
router.delete('/:productId/:diseaseId', controller.removeDiseaseFromProduct);

module.exports = router;