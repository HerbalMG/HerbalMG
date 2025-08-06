const sql = require('../config/supabase');

exports.getAddressesForCustomer = async (req, res) => {
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
};

exports.getAddressById = async (req, res) => {
  try {
    const [address] = await sql`
      SELECT * FROM address 
      WHERE id = ${req.params.addressId} AND customer_id = ${req.params.customerId}
    `;
    if (!address) return res.status(404).json({ error: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addAddress = async (req, res) => {
  const { address_line1, address_line2, city, state, pincode, country, is_default } = req.body;
  
  if (!address_line1 || !city || !state || !pincode) {
    return res.status(400).json({ 
      error: 'Address line 1, city, state, and pincode are required' 
    });
  }
  
  try {
    // Create address table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS address (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customer(id) ON DELETE CASCADE,
        address_line1 TEXT NOT NULL,
        address_line2 TEXT,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(20) NOT NULL,
        country VARCHAR(100) DEFAULT 'India',
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    // If this is set as default, unset other defaults for this customer
    if (is_default) {
      await sql`
        UPDATE address 
        SET is_default = false 
        WHERE customer_id = ${req.params.customerId}
      `;
    }
    
    const [address] = await sql`
      INSERT INTO address (customer_id, address_line1, address_line2, city, state, pincode, country, is_default)
      VALUES (${req.params.customerId}, ${address_line1}, ${address_line2 || null}, ${city}, ${state}, ${pincode}, ${country || 'India'}, ${is_default || false})
      RETURNING *
    `;
    
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  const { address_line1, address_line2, city, state, pincode, country, is_default } = req.body;
  
  try {
    // If this is set as default, unset other defaults for this customer
    if (is_default) {
      await sql`
        UPDATE address 
        SET is_default = false 
        WHERE customer_id = ${req.params.customerId} AND id != ${req.params.addressId}
      `;
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
      WHERE id = ${req.params.addressId} AND customer_id = ${req.params.customerId}
      RETURNING *
    `;
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const [deleted] = await sql`
      DELETE FROM address 
      WHERE id = ${req.params.addressId} AND customer_id = ${req.params.customerId}
      RETURNING *
    `;
    
    if (!deleted) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  try {
    // Unset all defaults for this customer
    await sql`
      UPDATE address 
      SET is_default = false 
      WHERE customer_id = ${req.params.customerId}
    `;
    
    // Set the specified address as default
    const [address] = await sql`
      UPDATE address 
      SET is_default = true, updated_at = NOW()
      WHERE id = ${req.params.addressId} AND customer_id = ${req.params.customerId}
      RETURNING *
    `;
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json(address);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};