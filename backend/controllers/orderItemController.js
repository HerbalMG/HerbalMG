const sql = require('../config/supabase');

exports.getAllOrderItems = async (req, res) => {
  try {
    const items = await sql`SELECT * FROM order_item ORDER BY id DESC`;
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const [item] = await sql`SELECT * FROM order_item WHERE id = ${req.params.id}`;
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrderItem = async (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  try {
    const [item] = await sql`
      INSERT INTO order_item (order_id, product_id, quantity, price)
      VALUES (${order_id}, ${product_id}, ${quantity}, ${price})
      RETURNING *`;
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrderItem = async (req, res) => {
  const { order_id, product_id, quantity, price } = req.body;
  try {
    const [item] = await sql`
      UPDATE order_item
      SET order_id = ${order_id},
          product_id = ${product_id},
          quantity = ${quantity},
          price = ${price},
          updated_at = NOW()
      WHERE id = ${req.params.id}
      RETURNING *`;
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const [deleted] = await sql`
      DELETE FROM order_item WHERE id = ${req.params.id}
      RETURNING *`;
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
