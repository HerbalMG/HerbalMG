const express = require('express');
const router = express.Router();
const controller = require('../controllers/deliveryStatusController');
const { validateDeliveryStatus } = require('../middleware/validateDeliveryStatus');

router.get('/', controller.getAllStatuses);
router.get('/:id', controller.getStatusById);
router.post('/', validateDeliveryStatus, controller.createStatus);
router.put('/:id', validateDeliveryStatus, controller.updateStatus);
router.delete('/:id', controller.deleteStatus);

module.exports = router;
