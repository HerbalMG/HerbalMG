const sql = require('../config/supabase');

exports.linkProductToMainCategory = async (req, res) => {
  try {
    const { productId, mainCategoryId } = req.body;
    
    await sql`UPDATE product SET main_category_id = ${mainCategoryId} WHERE id = ${productId}`;
    
    const [updated] = await sql`
      SELECT p.*, mc.name as main_category_name 
      FROM product p 
      LEFT JOIN main_category mc ON p.main_category_id = mc.id 
      WHERE p.id = ${productId}`;
    
    res.json({
      success: true,
      message: `Linked product ${productId} to main category ${mainCategoryId}`,
      product: updated
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};