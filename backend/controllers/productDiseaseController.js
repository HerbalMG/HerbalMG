const sql = require('../config/supabase');

// Add disease to product
exports.addDiseaseToProduct = async (req, res) => {
  try {
    const { productId, diseaseId } = req.body;
    
    const [relationship] = await sql`
      INSERT INTO product_disease (product_id, disease_id)
      VALUES (${productId}, ${diseaseId})
      ON CONFLICT (product_id, disease_id) DO NOTHING
      RETURNING *`;
    
    res.status(201).json(relationship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove disease from product
exports.removeDiseaseFromProduct = async (req, res) => {
  try {
    const { productId, diseaseId } = req.params;
    
    const [deleted] = await sql`
      DELETE FROM product_disease 
      WHERE product_id = ${productId} AND disease_id = ${diseaseId}
      RETURNING *`;
    
    if (!deleted) {
      return res.status(404).json({ error: 'Relationship not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all diseases for a product
exports.getProductDiseases = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const diseases = await sql`
      SELECT d.* FROM disease d
      JOIN product_disease pd ON d.id = pd.disease_id
      WHERE pd.product_id = ${productId}`;
    
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products for a disease
exports.getDiseaseProducts = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    
    const products = await sql`
      SELECT p.*, b.name as brand_name FROM product p
      LEFT JOIN brand b ON p.brand_id = b.id
      JOIN product_disease pd ON p.id = pd.product_id
      WHERE pd.disease_id = ${diseaseId}`;
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};