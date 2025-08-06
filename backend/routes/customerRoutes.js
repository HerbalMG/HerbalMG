const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const customerController = require('../controllers/customerController');
const addressController = require('../controllers/addressController');

// Customers
router.get('/', auth, requireAdmin, customerController.getAllCustomers);
router.get('/:id', auth, requireAdmin, customerController.getCustomerById);
router.get('/email/:email', customerController.getCustomerByEmail);
router.post('/public', customerController.createCustomerPublic);
router.post('/', auth, requireAdmin, customerController.createCustomer);
router.put('/:id', auth, requireAdmin, customerController.updateCustomer);
router.delete('/:id', auth, requireAdmin, customerController.deleteCustomer);

// Address Routes
router.get('/:customerId/addresses', auth, addressController.getAddressesForCustomer);
router.get('/:customerId/addresses/:addressId', auth, addressController.getAddressById);
router.post('/:customerId/addresses', auth, addressController.addAddress);
router.put('/:customerId/addresses/:addressId', auth, addressController.updateAddress);
router.delete('/:customerId/addresses/:addressId', auth, addressController.deleteAddress);
router.post('/:customerId/addresses/:addressId/set-default', auth, addressController.setDefaultAddress);

module.exports = router;