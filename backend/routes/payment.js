// const express = require('express');
// const router = express.Router();
// const sql = require('../config/supabase');
// const auth = require('./auth');

// function requireAdmin(req, res, next) {
//   if (!req.user || req.user.role !== 'admin') {
//     return res.status(403).json({ error: 'Forbidden: admin only' });
//   }
//   next();
// }

// // Get all payments
// router.get('/', auth, requireAdmin, async (req, res) => {
//   try {
//     const payments = await sql`SELECT * FROM payment ORDER BY id DESC`;
//     res.json(payments);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get payment by ID
// router.get('/:id', auth, requireAdmin, async (req, res) => {
//   try {
//     const [payment] = await sql`SELECT * FROM payment WHERE id = ${req.params.id}`;
//     if (!payment) return res.status(404).json({ error: 'Not found' });
//     res.json(payment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create payment
// router.post('/', auth, requireAdmin, async (req, res) => {
//   const { order_id, amount, status, method, payment_date } = req.body;
//   try {
//     const [payment] = await sql`INSERT INTO payment (order_id, amount, status, method, payment_date) VALUES (${order_id}, ${amount}, ${status}, ${method}, ${payment_date}) RETURNING *`;
//     res.status(201).json(payment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update payment
// router.put('/:id', auth, requireAdmin, async (req, res) => {
//   const { order_id, amount, status, method, payment_date } = req.body;
//   try {
//     const [payment] = await sql`UPDATE payment SET order_id=${order_id}, amount=${amount}, status=${status}, method=${method}, payment_date=${payment_date}, updated_at=NOW() WHERE id=${req.params.id} RETURNING *`;
//     if (!payment) return res.status(404).json({ error: 'Not found' });
//     res.json(payment);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete payment
// router.delete('/:id', auth, requireAdmin, async (req, res) => {
//   try {
//     const [deleted] = await sql`DELETE FROM payment WHERE id=${req.params.id} RETURNING *`;
//     if (!deleted) return res.status(404).json({ error: 'Not found' });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router; 


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/paymentController');

// Middleware
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: admin only' });
  }
  next();
}

// Routes
router.get('/', auth, requireAdmin, controller.getAllPayments);
router.get('/:id', auth, requireAdmin, controller.getPaymentById);
router.post('/', auth, requireAdmin, controller.createPayment);
router.put('/:id', auth, requireAdmin, controller.updatePayment);
router.delete('/:id', auth, requireAdmin, controller.deletePayment);

module.exports = router;
