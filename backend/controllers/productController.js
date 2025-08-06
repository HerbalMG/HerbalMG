const sql = require('../config/supabase');
const imagekit = require('../config/imagekit');
const extractImageKitFileId = require('../utils/extractImageKitFileId');
const { generateSlug, isNumericId } = require('../utils/slugUtils');

function safe(val) {
  return typeof val === 'undefined' ? null : val;
}

exports.getAllProducts = async (req, res) => {
  try {
    const {
      brandId, brand, brandSlug,
      category, categorySlug,
      mainCategory, mainCategorySlug,
      subCategory, subCategorySlug,
      disease, diseaseSlug,
      seasonal_medicine, frequently_bought, top_products, people_preferred, maximum_discount, 
      exclude_id, search
    } = req.query;

    // Base query with proper joins for relationships
    let query = sql`
      SELECT DISTINCT p.*, 
             b.name as brand_name, b.slug as brand_slug,
             mc.name as main_category_name, mc.slug as main_category_slug,
             sc.name as sub_category_name, sc.slug as sub_category_slug
      FROM product p 
      LEFT JOIN brand b ON p.brand_id = b.id
      LEFT JOIN main_category mc ON p.main_category_id = mc.id
      LEFT JOIN sub_category sc ON p.sub_category_id = sc.id
      LEFT JOIN product_disease pd ON p.id = pd.product_id
      LEFT JOIN disease d ON pd.disease_id = d.id
      WHERE 1=1`;

    const likeSearch = (val) => `%${val.toLowerCase()}%`;

    // Search functionality
    if (search) {
      const searchTerm = likeSearch(search);
      query = sql`${query} AND (
        LOWER(p.name) LIKE ${searchTerm} OR 
        LOWER(p.key) LIKE ${searchTerm} OR 
        LOWER(p.key_ingredients) LIKE ${searchTerm} OR 
        LOWER(p.description) LIKE ${searchTerm} OR
        LOWER(p.strength) LIKE ${searchTerm} OR
        LOWER(mc.name) LIKE ${searchTerm} OR
        LOWER(sc.name) LIKE ${searchTerm} OR
        LOWER(d.name) LIKE ${searchTerm}
      )`;
    }

    // Brand filters
    if (brandId) query = sql`${query} AND p.brand_id = ${brandId}`;
    else if (brand) query = sql`${query} AND LOWER(b.name) = LOWER(${brand})`;
    else if (brandSlug) query = sql`${query} AND b.slug = ${brandSlug}`;

    // Category filters (using existing category field)
    if (category) query = sql`${query} AND LOWER(p.category) = LOWER(${category})`;
    else if (categorySlug) {
      const [record] = await sql`
        SELECT name FROM main_category WHERE slug = ${categorySlug}
        UNION
        SELECT name FROM sub_category WHERE slug = ${categorySlug}`;
      if (record) query = sql`${query} AND LOWER(p.category) = LOWER(${record.name})`;
    }

    // Main category filters using proper relationships
    if (mainCategory) query = sql`${query} AND LOWER(mc.name) = LOWER(${mainCategory})`;
    else if (mainCategorySlug) {
      query = sql`${query} AND mc.slug = ${mainCategorySlug}`;
    }

    // Sub category filters using proper relationships
    if (subCategory) query = sql`${query} AND LOWER(sc.name) = LOWER(${subCategory})`;
    else if (subCategorySlug) {
      query = sql`${query} AND sc.slug = ${subCategorySlug}`;
    }

    // Disease filters using proper relationships
    if (disease) query = sql`${query} AND LOWER(d.name) = LOWER(${disease})`;
    else if (diseaseSlug) {
      query = sql`${query} AND d.slug = ${diseaseSlug}`;
    }

    // Exclude specific product (for similar products)
    if (exclude_id) {
      query = sql`${query} AND p.id != ${exclude_id}`;
    }



    // Boolean filters - Handle both boolean and string values
    const filters = {
      seasonal_medicine,
      frequently_bought,
      top_products,
      people_preferred,
      maximum_discount
    };

    for (const [key, value] of Object.entries(filters)) {
      if (value === true || value === 'true') {
        // Filter for products where flag is true
        query = sql`${query} AND p.${sql(key)} = true`;
      } else if (value === false || value === 'false') {
        // Filter for products where flag is false
        query = sql`${query} AND p.${sql(key)} = false`;
      }
      // If value is undefined or null, no filter is applied
    }

    query = sql`${query} ORDER BY p.id DESC`;
    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductByIdOrSlug = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isId = /^\d+$/.test(identifier);
    
    const [product] = isId
      ? await sql`
          SELECT p.*, 
                 b.name as brand_name, b.slug as brand_slug,
                 mc.name as main_category_name, mc.slug as main_category_slug,
                 sc.name as sub_category_name, sc.slug as sub_category_slug
          FROM product p 
          LEFT JOIN brand b ON p.brand_id = b.id
          LEFT JOIN main_category mc ON p.main_category_id = mc.id
          LEFT JOIN sub_category sc ON p.sub_category_id = sc.id
          WHERE p.id = ${identifier}`
      : await sql`
          SELECT p.*, 
                 b.name as brand_name, b.slug as brand_slug,
                 mc.name as main_category_name, mc.slug as main_category_slug,
                 sc.name as sub_category_name, sc.slug as sub_category_slug
          FROM product p 
          LEFT JOIN brand b ON p.brand_id = b.id
          LEFT JOIN main_category mc ON p.main_category_id = mc.id
          LEFT JOIN sub_category sc ON p.sub_category_id = sc.id
          WHERE p.slug = ${identifier}`;

    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const fields = req.body;
    
    // Generate slug if not provided
    const finalSlug = fields.slug || generateSlug(fields.name);
    
    // First, let's check if the relationship columns exist
    let hasRelationshipColumns = false;
    try {
      await sql`SELECT main_category_id FROM product LIMIT 1`;
      hasRelationshipColumns = true;
    } catch (e) {
      // Columns don't exist yet
      hasRelationshipColumns = false;
    }
    
    let product;
    if (hasRelationshipColumns) {
      // Use the new schema with relationships
      [product] = await sql`
        INSERT INTO product (
          name, slug, category, medicine_type, images, brand_id, main_category_id, sub_category_id,
          reference_books, key, key_ingredients, description, strength,
          prescription_required, actual_price, selling_price, discount_percent, total_quantity,
          seasonal_medicine, frequently_bought, top_products, people_preferred, maximum_discount, dosage, dietary
        )
        VALUES (
          ${safe(fields.name)}, ${finalSlug}, ${safe(fields.category)}, ${safe(fields.medicine_type)},
          ${safe(fields.images)}, ${safe(fields.brand_id)}, ${safe(fields.main_category_id)}, ${safe(fields.sub_category_id)},
          ${safe(fields.reference_books)}, ${safe(fields.key)}, ${safe(fields.key_ingredients)}, ${safe(fields.description)}, 
          ${safe(fields.strength)}, ${safe(fields.prescription_required)}, ${safe(fields.actual_price)}, ${safe(fields.selling_price)},
          ${safe(fields.discount_percent)}, ${safe(fields.total_quantity)}, ${safe(fields.seasonal_medicine)},
          ${safe(fields.frequently_bought)}, ${safe(fields.top_products)}, ${safe(fields.people_preferred)},
          ${safe(fields.maximum_discount)}, ${safe(fields.dosage)}, ${safe(fields.dietary)}
        )
        RETURNING *`;
      
      // Handle disease relationships if provided
      if (fields.disease_ids && Array.isArray(fields.disease_ids)) {
        for (const diseaseId of fields.disease_ids) {
          try {
            await sql`
              INSERT INTO product_disease (product_id, disease_id)
              VALUES (${product.id}, ${diseaseId})
              ON CONFLICT (product_id, disease_id) DO NOTHING`;
          } catch (e) {
            console.log('Disease relationship not added:', e.message);
          }
        }
      }
    } else {
      // Use the old schema without relationships
      [product] = await sql`
        INSERT INTO product (
          name, slug, category, medicine_type, images, brand_id, reference_books, key, key_ingredients, description, strength,
          prescription_required, actual_price, selling_price, discount_percent, total_quantity,
          seasonal_medicine, frequently_bought, top_products, people_preferred, maximum_discount, dosage, dietary
        )
        VALUES (
          ${safe(fields.name)}, ${finalSlug}, ${safe(fields.category)}, ${safe(fields.medicine_type)},
          ${safe(fields.images)}, ${safe(fields.brand_id)}, ${safe(fields.reference_books)}, ${safe(fields.key)},
          ${safe(fields.key_ingredients)}, ${safe(fields.description)}, ${safe(fields.strength)},
          ${safe(fields.prescription_required)}, ${safe(fields.actual_price)}, ${safe(fields.selling_price)},
          ${safe(fields.discount_percent)}, ${safe(fields.total_quantity)}, ${safe(fields.seasonal_medicine)},
          ${safe(fields.frequently_bought)}, ${safe(fields.top_products)}, ${safe(fields.people_preferred)},
          ${safe(fields.maximum_discount)}, ${safe(fields.dosage)}, ${safe(fields.dietary)}
        )
        RETURNING *`;
    }
    
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('duplicate') && err.message.includes('slug')) {
      res.status(400).json({ error: 'A product with this slug already exists. Please choose a different name or provide a custom slug.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { identifier } = req.params;
    const isId = isNumericId(identifier);
    const where = isId ? sql`id = ${identifier}` : sql`slug = ${identifier}`;
    const fields = req.body;

    // Generate slug if name is provided but slug is not
    const finalSlug = fields.slug || (fields.name ? generateSlug(fields.name) : undefined);

    // Check if relationship columns exist
    let hasRelationshipColumns = false;
    try {
      await sql`SELECT main_category_id FROM product LIMIT 1`;
      hasRelationshipColumns = true;
    } catch (e) {
      hasRelationshipColumns = false;
    }

    let updated;
    if (hasRelationshipColumns) {
      // Use the new schema with relationships
      [updated] = await sql`
        UPDATE product SET
          name=${safe(fields.name)}, slug=${safe(finalSlug)}, category=${safe(fields.category)},
          medicine_type=${safe(fields.medicine_type)}, images=${safe(fields.images)}, brand_id=${safe(fields.brand_id)},
          main_category_id=${safe(fields.main_category_id)}, sub_category_id=${safe(fields.sub_category_id)},
          reference_books=${safe(fields.reference_books)}, key=${safe(fields.key)}, key_ingredients=${safe(fields.key_ingredients)},
          description=${safe(fields.description)}, strength=${safe(fields.strength)}, prescription_required=${safe(fields.prescription_required)},
          actual_price=${safe(fields.actual_price)}, selling_price=${safe(fields.selling_price)}, discount_percent=${safe(fields.discount_percent)},
          total_quantity=${safe(fields.total_quantity)}, seasonal_medicine=${safe(fields.seasonal_medicine)},
          frequently_bought=${safe(fields.frequently_bought)}, top_products=${safe(fields.top_products)},
          people_preferred=${safe(fields.people_preferred)}, maximum_discount=${safe(fields.maximum_discount)},
          dosage=${safe(fields.dosage)}, dietary=${safe(fields.dietary)}, updated_at=NOW()
        WHERE ${where}
        RETURNING *`;

      // Handle disease relationships if provided
      if (fields.disease_ids !== undefined) {
        try {
          // Remove existing relationships
          await sql`DELETE FROM product_disease WHERE product_id = ${updated.id}`;
          
          // Add new relationships
          if (Array.isArray(fields.disease_ids)) {
            for (const diseaseId of fields.disease_ids) {
              await sql`
                INSERT INTO product_disease (product_id, disease_id)
                VALUES (${updated.id}, ${diseaseId})`;
            }
          }
        } catch (e) {
          console.log('Disease relationship not updated:', e.message);
        }
      }
    } else {
      // Use the old schema without relationships
      [updated] = await sql`
        UPDATE product SET
          name=${safe(fields.name)}, slug=${safe(finalSlug)}, category=${safe(fields.category)},
          medicine_type=${safe(fields.medicine_type)}, images=${safe(fields.images)}, brand_id=${safe(fields.brand_id)},
          reference_books=${safe(fields.reference_books)}, key=${safe(fields.key)}, key_ingredients=${safe(fields.key_ingredients)},
          description=${safe(fields.description)}, strength=${safe(fields.strength)}, prescription_required=${safe(fields.prescription_required)},
          actual_price=${safe(fields.actual_price)}, selling_price=${safe(fields.selling_price)}, discount_percent=${safe(fields.discount_percent)},
          total_quantity=${safe(fields.total_quantity)}, seasonal_medicine=${safe(fields.seasonal_medicine)},
          frequently_bought=${safe(fields.frequently_bought)}, top_products=${safe(fields.top_products)},
          people_preferred=${safe(fields.people_preferred)}, maximum_discount=${safe(fields.maximum_discount)},
          dosage=${safe(fields.dosage)}, dietary=${safe(fields.dietary)}, updated_at=NOW()
        WHERE ${where}
        RETURNING *`;
    }

    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  } catch (err) {
    if (err.message.includes('duplicate') && err.message.includes('slug')) {
      res.status(400).json({ error: 'A product with this slug already exists. Please choose a different slug.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const isId = /^\d+$/.test(identifier);
    const where = isId ? sql`id = ${identifier}` : sql`slug = ${identifier}`;
    const [product] = await sql`SELECT * FROM product WHERE ${where}`;
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Delete images from ImageKit
    let imageUrls = product.images || [];
    if (typeof imageUrls === 'string') {
      try {
        imageUrls = JSON.parse(imageUrls);
      } catch {
        imageUrls = imageUrls.split(',').map(s => s.trim());
      }
    }
    for (const url of imageUrls) {
      const filePath = extractImageKitFileId(url);
      if (filePath) {
        try {
          // List files to find the file by path
          const files = await imagekit.listFiles({
            path: '/' + filePath.split('/').slice(0, -1).join('/'),
            searchQuery: `name="${filePath.split('/').pop().split('.')[0]}"`,
          });

          if (files.length > 0) {
            await imagekit.deleteFile(files[0].fileId);
          }
        } catch (imagekitErr) {
          console.error('ImageKit error:', imagekitErr);
        }
      }
    }

    // Delete product (cascade will handle product_disease relationships)
    const [deleted] = await sql`DELETE FROM product WHERE ${where} RETURNING *`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

