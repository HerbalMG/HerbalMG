const express = require('express');
const router = express.Router();
const sql = require('../config/supabase');
const auth = require('../middleware/auth');

// Get all addresses for a customer
router.get('/customer/:customerId', auth, async (req, res) => {
  try {
    const addresses = await sql`
      SELECT * FROM address 
      WHERE customer_id = ${req.params.customerId}
      ORDER BY is_default DESC, created_at DESC
    `;
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new address
router.post('/', auth, async (req, res) => {
  const { customer_id, address_line1, address_line2, city, state, pincode, country, is_default } = req.body;
  
  if (!customer_id || !address_line1 || !city || !state || !pincode) {
    return res.status(400).json({ 
      error: 'Customer ID, address line 1, city, state, and pincode are required' 
    });
  }
  
  try {
    // If this is set as default, unset other defaults for this customer
    if (is_default) {
      await sql`
        UPDATE address 
        SET is_default = false 
        WHERE customer_id = ${customer_id}
      `;
    }
    
    const [address] = await sql`
      INSERT INTO address (customer_id, address_line1, address_line2, city, state, pincode, country, is_default)
      VALUES (${customer_id}, ${address_line1}, ${address_line2 || null}, ${city}, ${state}, ${pincode}, ${country || 'India'}, ${is_default || false})
      RETURNING *
    `;
    
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update address
router.put('/:id', auth, async (req, res) => {
  const { address_line1, address_line2, city, state, pincode, country, is_default } = req.body;
  
  try {
    // If this is set as default, unset other defaults for this customer
    if (is_default) {
      const [currentAddress] = await sql`SELECT customer_id FROM address WHERE id = ${req.params.id}`;
      if (currentAddress) {
        await sql`
          UPDATE address 
          SET is_default = false 
          WHERE customer_id = ${currentAddress.customer_id} AND id != ${req.params.id}
        `;
      }
    }
    
    const [address] = await sql`
      UPDATE address 
      SET address_line1 = ${address_line1}, 
          address_line2 = ${address_line2 || null}, 
          city = ${city}, 
          state = ${state}, 
          pincode = ${pincode}, 
          country = ${country || 'India'}, 
          is_default = ${is_default || false},
          updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *
    `;
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete address
router.delete('/:id', auth, async (req, res) => {
  try {
    const [deleted] = await sql`
      DELETE FROM address 
      WHERE id = ${req.params.id} 
      RETURNING *
    `;
    
    if (!deleted) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;