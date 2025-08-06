// const express = require('express');
// const router = express.Router();
// const sql = require('../config/supabase');
// const imagekit = require('../config/imagekit');
// const auth = require('./auth');

// function requireAdminOrLimitedAdmin(req, res, next) {
//   if (!req.user || !['admin', 'limited_admin'].includes(req.user.role)) {
//     return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
//   }
//   next();
// }

// const extractImageKitFileId = require('../utils/extractImageKitFileId');

// function safe(val) {
//   return typeof val === 'undefined' ? null : val;
// }

// // Get all products, optionally filter by brand, category, disease, and special flags
// router.get('/', async (req, res) => {
//   try {
//     const { 
//       brandId, brand, brandSlug,
//       category, categorySlug, 
//       mainCategory, mainCategorySlug,
//       subCategory, subCategorySlug,
//       disease, diseaseSlug,
//       seasonal_medicine, frequently_bought, top_products, people_preferred, maximum_discount, search 
//     } = req.query;
    
//     console.log('Query params:', req.query);
    
//     // Build the query using sql template literals for proper SQL injection protection
//     let query = sql`SELECT p.*, b.name as brand_name, b.slug as brand_slug FROM product p LEFT JOIN brand b ON p.brand_id = b.id WHERE 1=1`;
    
//     if (search) {
//       const searchTerm = `%${search.toLowerCase()}%`;
//       query = sql`${query} AND (
//         LOWER(p.name) LIKE ${searchTerm} OR 
//         LOWER(p.key) LIKE ${searchTerm} OR 
//         LOWER(p.key_ingredients) LIKE ${searchTerm} OR 
//         LOWER(p.description) LIKE ${searchTerm} OR
//         LOWER(p.strength) LIKE ${searchTerm}
//       )`;
//     }
    
//     // Brand filtering - support ID, name, or slug
//     if (brandId) {
//       console.log('Adding brand ID filter:', brandId);
//       query = sql`${query} AND p.brand_id = ${brandId}`;
//     } else if (brand) {
//       console.log('Adding brand name filter:', brand);
//       query = sql`${query} AND LOWER(b.name) = LOWER(${brand})`;
//     } else if (brandSlug) {
//       console.log('Adding brand slug filter:', brandSlug);
//       query = sql`${query} AND b.slug = ${brandSlug}`;
//     }
    
//     // Category filtering - support direct category name or slug lookup
//     if (category) {
//       console.log('Adding category filter:', category);
//       query = sql`${query} AND LOWER(p.category) = LOWER(${category})`;
//     } else if (categorySlug) {
//       console.log('Adding category slug filter:', categorySlug);
//       // For category slug, we need to look up the actual category name
//       const [categoryRecord] = await sql`SELECT name FROM main_category WHERE slug = ${categorySlug} 
//                                         UNION SELECT name FROM sub_category WHERE slug = ${categorySlug}`;
//       if (categoryRecord) {
//         query = sql`${query} AND LOWER(p.category) = LOWER(${categoryRecord.name})`;
//       }
//     }
    
//     // Main category filtering
//     if (mainCategory) {
//       console.log('Adding main category filter:', mainCategory);
//       query = sql`${query} AND LOWER(p.category) = LOWER(${mainCategory})`;
//     } else if (mainCategorySlug) {
//       console.log('Adding main category slug filter:', mainCategorySlug);
//       const [mainCategoryRecord] = await sql`SELECT name FROM main_category WHERE slug = ${mainCategorySlug}`;
//       if (mainCategoryRecord) {
//         query = sql`${query} AND LOWER(p.category) = LOWER(${mainCategoryRecord.name})`;
//       }
//     }
    
//     // Sub category filtering
//     if (subCategory) {
//       console.log('Adding sub category filter:', subCategory);
//       query = sql`${query} AND LOWER(p.category) = LOWER(${subCategory})`;
//     } else if (subCategorySlug) {
//       console.log('Adding sub category slug filter:', subCategorySlug);
//       const [subCategoryRecord] = await sql`SELECT name FROM sub_category WHERE slug = ${subCategorySlug}`;
//       if (subCategoryRecord) {
//         query = sql`${query} AND LOWER(p.category) = LOWER(${subCategoryRecord.name})`;
//       }
//     }
    
//     // Disease filtering - support name or slug
//     if (disease) {
//       const diseaseTerm = `%${disease.toLowerCase()}%`;
//       console.log('Adding disease filter:', disease, '-> search term:', diseaseTerm);
//       query = sql`${query} AND (
//         LOWER(p.name) LIKE ${diseaseTerm} OR 
//         LOWER(COALESCE(p.description, '')) LIKE ${diseaseTerm} OR 
//         LOWER(COALESCE(p.key_ingredients, '')) LIKE ${diseaseTerm} OR
//         LOWER(COALESCE(p.category, '')) LIKE ${diseaseTerm}
//       )`;
//     } else if (diseaseSlug) {
//       console.log('Adding disease slug filter:', diseaseSlug);
//       const [diseaseRecord] = await sql`SELECT name FROM disease WHERE slug = ${diseaseSlug}`;
//       if (diseaseRecord) {
//         const diseaseTerm = `%${diseaseRecord.name.toLowerCase()}%`;
//         query = sql`${query} AND (
//           LOWER(p.name) LIKE ${diseaseTerm} OR 
//           LOWER(COALESCE(p.description, '')) LIKE ${diseaseTerm} OR 
//           LOWER(COALESCE(p.key_ingredients, '')) LIKE ${diseaseTerm} OR
//           LOWER(COALESCE(p.category, '')) LIKE ${diseaseTerm}
//         )`;
//       }
//     }
    
//     // Boolean filters
//     if (seasonal_medicine !== undefined) {
//       const boolValue = seasonal_medicine === 'true';
//       console.log('Adding seasonal_medicine filter:', seasonal_medicine, '-> boolean:', boolValue);
//       query = sql`${query} AND p.seasonal_medicine = ${boolValue}`;
//     }
    
//     if (frequently_bought !== undefined) {
//       const boolValue = frequently_bought === 'true';
//       console.log('Adding frequently_bought filter:', frequently_bought, '-> boolean:', boolValue);
//       query = sql`${query} AND p.frequently_bought = ${boolValue}`;
//     }
    
//     if (top_products !== undefined) {
//       const boolValue = top_products === 'true';
//       console.log('Adding top_products filter:', top_products, '-> boolean:', boolValue);
//       query = sql`${query} AND p.top_products = ${boolValue}`;
//     }
    
//     if (people_preferred !== undefined) {
//       const boolValue = people_preferred === 'true';
//       console.log('Adding people_preferred filter:', people_preferred, '-> boolean:', boolValue);
//       query = sql`${query} AND p.people_preferred = ${boolValue}`;
//     }
    
//     if (maximum_discount !== undefined) {
//       const boolValue = maximum_discount === 'true';
//       console.log('Adding maximum_discount filter:', maximum_discount, '-> boolean:', boolValue);
//       query = sql`${query} AND p.maximum_discount = ${boolValue}`;
//     }
    
//     query = sql`${query} ORDER BY p.id DESC`;
    
//     console.log('Final query object:', query);
    
//     const products = await query;
//     console.log('Query results:', products.length, 'products found');
//     res.json(products);
//   } catch (err) {
//     console.error('Product query error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get product by ID or slug
// router.get('/:identifier', async (req, res) => {
//   try {
//     const identifier = req.params.identifier;
//     let product;
    
//     // Check if identifier is numeric (ID) or string (slug)
//     if (/^\d+$/.test(identifier)) {
//       // It's an ID
//       [product] = await sql`SELECT * FROM product WHERE id = ${identifier}`;
//     } else {
//       // It's a slug
//       [product] = await sql`SELECT * FROM product WHERE slug = ${identifier}`;
//     }
    
//     if (!product) return res.status(404).json({ error: 'Product not found' });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create product
// router.post('/', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   console.log('POST /api/product payload:', req.body);
//   const {
//     name,
//     slug,
//     category,
//     medicine_type,
//     images,
//     brand_id,
//     reference_books,
//     key,
//     key_ingredients,
//     description,
//     strength,
//     prescription_required,
//     actual_price,
//     selling_price,
//     discount_percent,
//     total_quantity,
//     seasonal_medicine,
//     frequently_bought,
//     top_products,
//     people_preferred,
//     maximum_discount,
//     dosage,
//     dietary
//   } = req.body;
  
//   try {
//     // Include slug in the insert - trigger will auto-generate if not provided
//     const [product] = await sql`
//       INSERT INTO product (
//         name, slug, category, medicine_type, images, brand_id, reference_books, key, key_ingredients, description, strength, prescription_required, actual_price, selling_price, discount_percent, total_quantity, seasonal_medicine, frequently_bought, top_products, people_preferred, maximum_discount, dosage, dietary
//       )
//       VALUES (
//         ${safe(name)}, ${safe(slug)}, ${safe(category)}, ${safe(medicine_type)}, ${safe(images)}, ${safe(brand_id)}, ${safe(reference_books)}, ${safe(key)}, ${safe(key_ingredients)}, ${safe(description)}, ${safe(strength)}, ${safe(prescription_required)}, ${safe(actual_price)}, ${safe(selling_price)}, ${safe(discount_percent)}, ${safe(total_quantity)}, ${safe(seasonal_medicine)}, ${safe(frequently_bought)}, ${safe(top_products)}, ${safe(people_preferred)}, ${safe(maximum_discount)}, ${safe(dosage)}, ${safe(dietary)}
//       )
//       RETURNING *`;
//     res.status(201).json(product);
//   } catch (err) {
//     console.error('Error creating product:', err);
//     console.error('SQL Error details:', err.message);
    
//     // Handle unique constraint violation for slug
//     if (err.message.includes('duplicate key value violates unique constraint') && err.message.includes('slug')) {
//       res.status(400).json({ error: 'A product with this slug already exists. Please choose a different name or provide a custom slug.' });
//     } else {
//       res.status(500).json({ error: err.message });
//     }
//   }
// });

// // Update product by ID or slug
// router.put('/:identifier', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   console.log('PUT /api/product payload:', req.body);
//   const {
//     name,
//     slug,
//     category,
//     medicine_type,
//     images,
//     brand_id,
//     reference_books,
//     key,
//     key_ingredients,
//     description,
//     strength,
//     prescription_required,
//     actual_price,
//     selling_price,
//     discount_percent,
//     total_quantity,
//     seasonal_medicine,
//     frequently_bought,
//     top_products,
//     people_preferred,
//     maximum_discount,
//     dosage,
//     dietary
//   } = req.body;
  
//   try {
//     const identifier = req.params.identifier;
//     let whereClause;
    
//     // Check if identifier is numeric (ID) or string (slug)
//     if (/^\d+$/.test(identifier)) {
//       whereClause = sql`id = ${identifier}`;
//     } else {
//       whereClause = sql`slug = ${identifier}`;
//     }
    
//     const [product] = await sql`
//       UPDATE product SET
//         name=${safe(name)},
//         slug=${safe(slug)},
//         category=${safe(category)},
//         medicine_type=${safe(medicine_type)},
//         images=${safe(images)},
//         brand_id=${safe(brand_id)},
//         reference_books=${safe(reference_books)},
//         key=${safe(key)},
//         key_ingredients=${safe(key_ingredients)},
//         description=${safe(description)},
//         strength=${safe(strength)},
//         prescription_required=${safe(prescription_required)},
//         actual_price=${safe(actual_price)},
//         selling_price=${safe(selling_price)},
//         discount_percent=${safe(discount_percent)},
//         total_quantity=${safe(total_quantity)},
//         seasonal_medicine=${safe(seasonal_medicine)},
//         frequently_bought=${safe(frequently_bought)},
//         top_products=${safe(top_products)},
//         people_preferred=${safe(people_preferred)},
//         maximum_discount=${safe(maximum_discount)},
//         dosage=${safe(dosage)},
//         dietary=${safe(dietary)},
//         updated_at=NOW()
//       WHERE ${whereClause} RETURNING *`;
      
//     if (!product) return res.status(404).json({ error: 'Product not found' });
//     res.json(product);
//   } catch (err) {
//     console.error('Error updating product:', err);
    
//     // Handle unique constraint violation for slug
//     if (err.message.includes('duplicate key value violates unique constraint') && err.message.includes('slug')) {
//       res.status(400).json({ error: 'A product with this slug already exists. Please choose a different slug.' });
//     } else {
//       res.status(500).json({ error: err.message });
//     }
//   }
// });

// // Delete product by ID or slug
// router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, async (req, res) => {
//   try {
//     const identifier = req.params.identifier;
//     let product;
    
//     // Check if identifier is numeric (ID) or string (slug)
//     if (/^\d+$/.test(identifier)) {
//       [product] = await sql`SELECT * FROM product WHERE id = ${identifier}`;
//     } else {
//       [product] = await sql`SELECT * FROM product WHERE slug = ${identifier}`;
//     }
    
//     console.log('Fetched product:', product);
//     if (!product) return res.status(404).json({ error: 'Product not found' });
    
//     // Delete images from ImageKit if present
//     if (product.images) {
//       let imageUrls = product.images;
//       if (typeof imageUrls === 'string') {
//         // Try to parse as JSON array, fallback to comma-separated
//         try {
//           imageUrls = JSON.parse(imageUrls);
//         } catch {
//           imageUrls = imageUrls.split(',').map(s => s.trim());
//         }
//       }
//       if (!Array.isArray(imageUrls)) imageUrls = [imageUrls];
//       for (const url of imageUrls) {
//         const filePath = extractImageKitFileId(url);
//         console.log('Deleting product image:', url, 'Extracted filePath:', filePath);
//         if (filePath) {
//           try {
//             const files = await imagekit.listFiles({
//               path: '/' + filePath.split('/').slice(0, -1).join('/'),
//               searchQuery: `name="${filePath.split('/').pop().split('.')[0]}"`,
//             });
//             if (files.length > 0) {
//               await imagekit.deleteFile(files[0].fileId);
//             }
//           } catch (imagekitErr) {
//             console.error('ImageKit delete error:', imagekitErr);
//           }
//         }
//       }
//     }
    
//     // Delete product from DB using the same identifier logic
//     let whereClause;
//     if (/^\d+$/.test(identifier)) {
//       whereClause = sql`id = ${identifier}`;
//     } else {
//       whereClause = sql`slug = ${identifier}`;
//     }
    
//     const [deleted] = await sql`DELETE FROM product WHERE ${whereClause} RETURNING *`;
//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // TODO: Add role-based access control middleware. Allow 'admin' and 'limited_admin' to add/edit products.

// module.exports = router;


const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const auth = require('../middleware/auth');

function requireAdminOrLimitedAdmin(req, res, next) {
  if (!req.user || !['admin', 'limited_admin'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
  }
  next();
}

// Public routes
router.get('/', controller.getAllProducts);
router.get('/:identifier', controller.getProductByIdOrSlug);

// Admin routes
router.post('/', auth, requireAdminOrLimitedAdmin, controller.createProduct);
router.put('/:identifier', auth, requireAdminOrLimitedAdmin, controller.updateProduct);
router.delete('/:identifier', auth, requireAdminOrLimitedAdmin, controller.deleteProduct);

module.exports = router;
