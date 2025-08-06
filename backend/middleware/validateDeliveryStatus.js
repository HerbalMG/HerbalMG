exports.validateDeliveryStatus = (req, res, next) => {
  const { order_date, delivery_date, delivery_status, payment_type } = req.body;

  if (!order_date || !delivery_date || !delivery_status || !payment_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // You can add more validation (e.g. date format, enum checks) here

  next();
};
