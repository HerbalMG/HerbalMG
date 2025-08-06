const sql = require('../config/supabase');

exports.getAllPrices = async (req, res) => {
  try {
    const prices = await sql`SELECT * FROM product_price ORDER BY created_at DESC`;
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPriceById = async (req, res) => {
  try {
    const [price] = await sql`SELECT * FROM product_price WHERE id = ${req.params.id}`;
    if (!price) return res.status(404).json({ error: 'Not found' });
    res.json(price);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPricesByProductId = async (req, res) => {
  try {
    const prices = await sql`
      SELECT * FROM product_price 
      WHERE product_id = ${req.params.productId} 
      ORDER BY created_at ASC`;
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createMultiplePrices = async (req, res) => {
  const { productId, prices } = req.body;
  try {
    const createdPrices = [];
    for (const price of prices) {
      const [createdPrice] = await sql`
        INSERT INTO product_price (
          product_id, size, actual_price, discount_percent, selling_price, quantity
        ) VALUES (
          ${productId}, ${price.size}, ${price.actual_price}, ${price.discount_percent},
          ${price.selling_price}, ${price.quantity}
        )
        RETURNING *`;
      createdPrices.push(createdPrice);
    }
    res.status(201).json(createdPrices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePricesForProduct = async (req, res) => {
  const { prices } = req.body;
  const productId = req.params.productId;

  try {
    await sql`DELETE FROM product_price WHERE product_id = ${productId}`;
    const updatedPrices = [];
    for (const price of prices) {
      const [updatedPrice] = await sql`
        INSERT INTO product_price (
          product_id, size, actual_price, discount_percent, selling_price, quantity
        ) VALUES (
          ${productId}, ${price.size}, ${price.actual_price}, ${price.discount_percent},
          ${price.selling_price}, ${price.quantity}
        )
        RETURNING *`;
      updatedPrices.push(updatedPrice);
    }
    res.json(updatedPrices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePriceById = async (req, res) => {
  try {
    const [price] = await sql`
      DELETE FROM product_price WHERE id=${req.params.id} RETURNING *`;
    if (!price) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
