// const express = require('express');
// const router = express.Router();
// const sql = require('../config/supabase');
// const auth = require('./auth');
// const { generateSlug, isNumericId } = require('../utils/slugUtils');

// function requireAdminOrLimitedAdmin(req, res, next) {
//   if (!req.user || !['admin', 'limited_admin'].includes(req.user.role)) {
//     return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
//   }
//   next();
// }



// // Get all diseases
// router.get('/', async (req, res) => {
//   try {
//     const diseases = await sql`SELECT * FROM disease ORDER BY id DESC`;
//     res.json(diseases);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get disease by ID or slug
// router.get('/:identifier', async (req, res) => {
//   try {
//     const identifier = req.params.identifier;
//     let disease;
    
//     if (isNumericId(identifier)) {
//       // It's an ID
//       [disease] = await sql`SELECT * FROM disease WHERE id = ${identifier}`;
//     } else {
//       // It's a slug
//       [disease] = await sql`SELECT * FROM disease WHERE slug = ${identifier}`;
//     }
    
//     if (!disease) return res.status(404).json({ error: 'Disease not found' });
//     res.json(disease);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create disease
// router.post('/', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   const { name, slug } = req.body;
//   try {
//     const finalSlug = slug || generateSlug(name);
//     const [disease] = await sql`INSERT INTO disease (name, slug) VALUES (${name}, ${finalSlug}) RETURNING *`;
//     res.status(201).json(disease);
//   } catch (err) {
//     if (err.message.includes('duplicate key value violates unique constraint') && err.message.includes('slug')) {
//       res.status(400).json({ error: 'A disease with this slug already exists. Please choose a different name or provide a custom slug.' });
//     } else {
//       res.status(500).json({ error: err.message });
//     }
//   }
// });

// // Update disease by ID or slug
// router.put('/:identifier', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   const { name, slug } = req.body;
//   try {
//     const identifier = req.params.identifier;
//     const finalSlug = slug || generateSlug(name);
//     let whereClause;
    
//     if (isNumericId(identifier)) {
//       whereClause = sql`id = ${identifier}`;
//     } else {
//       whereClause = sql`slug = ${identifier}`;
//     }
    
//     const [disease] = await sql`UPDATE disease SET name=${name}, slug=${finalSlug}, updated_at=NOW() WHERE ${whereClause} RETURNING *`;
//     if (!disease) return res.status(404).json({ error: 'Disease not found' });
//     res.json(disease);
//   } catch (err) {
//     if (err.message.includes('duplicate key value violates unique constraint') && err.message.includes('slug')) {
//       res.status(400).json({ error: 'A disease with this slug already exists. Please choose a different slug.' });
//     } else {
//       res.status(500).json({ error: err.message });
//     }
//   }
// });

// // Delete disease by ID or slug
// router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   try {
//     const identifier = req.params.identifier;
//     let whereClause;
    
//     if (isNumericId(identifier)) {
//       whereClause = sql`id = ${identifier}`;
//     } else {
//       whereClause = sql`slug = ${identifier}`;
//     }
    
//     const [disease] = await sql`DELETE FROM disease WHERE ${whereClause} RETURNING *`;
//     if (!disease) return res.status(404).json({ error: 'Disease not found' });
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router; 




const express = require('express');
const router = express.Router();
const controller = require('../controllers/diseaseController');
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdminOrLimitedAdmin');

// Public routes
router.get('/', controller.getAllDiseases);
router.get('/:identifier', controller.getDiseaseByIdentifier);

// Protected routes
router.post('/', auth, requireAdminOrLimitedAdmin, controller.createDisease);
router.put('/:identifier', auth, requireAdminOrLimitedAdmin, controller.updateDisease);
router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, controller.deleteDisease);

module.exports = router;
