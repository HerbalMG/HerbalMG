const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderItemController');

// Routes
router.get('/', controller.getAllOrderItems);
router.get('/:id', controller.getOrderItemById);
router.post('/', controller.createOrderItem);
router.put('/:id', controller.updateOrderItem);
router.delete('/:id', controller.deleteOrderItem);

module.exports = router;
