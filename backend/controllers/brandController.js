const sql = require('../config/supabase');
const imagekit = require('../config/imagekit');
const { generateSlug, isNumericId } = require('../utils/slugUtils');
const extractImageKitFileId = require('../utils/extractImageKitFileId');

// Get all brands
exports.getAll = async (req, res) => {
  try {
    const brands = await sql`SELECT * FROM brand ORDER BY id DESC`;
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get top brands
exports.getTopBrands = async (req, res) => {
  try {
    const topBrands = await sql`SELECT * FROM brand WHERE is_top_brand = true ORDER BY id DESC`;
    res.json(topBrands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get brand by ID or slug
exports.getByIdentifier = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const [brand] = isNumericId(identifier)
      ? await sql`SELECT * FROM brand WHERE id = ${identifier}`
      : await sql`SELECT * FROM brand WHERE slug = ${identifier}`;
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create brand
exports.create = async (req, res) => {
  const { name, slug, logo_url, banner_url, is_top_brand = false } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  try {
    const finalSlug = slug || generateSlug(name);
    
    // Handle potential duplicates
    let uniqueSlug = finalSlug;
    let counter = 1;
    while (true) {
      const existing = await sql`SELECT id FROM brand WHERE slug = ${uniqueSlug}`;
      if (existing.length === 0) break;
      uniqueSlug = `${finalSlug}-${counter}`;
      counter++;
    }
    
    const [brand] = await sql`
      INSERT INTO brand (name, slug, logo_url, banner_url, is_top_brand)
      VALUES (${name}, ${uniqueSlug}, ${logo_url || null}, ${banner_url || null}, ${is_top_brand})
      RETURNING *`;
    res.status(201).json(brand);
  } catch (err) {
    console.error('Brand creation error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update brand by ID or slug
exports.update = async (req, res) => {
  const { name, slug, logo_url, banner_url, is_top_brand = false } = req.body;
  try {
    const identifier = req.params.identifier;
    const finalSlug = slug || generateSlug(name);
    const whereClause = isNumericId(identifier)
      ? sql`id = ${identifier}`
      : sql`slug = ${identifier}`;

    const [brand] = await sql`
      UPDATE brand SET name=${name}, slug=${finalSlug}, logo_url=${logo_url || null},
      banner_url=${banner_url || null}, is_top_brand=${is_top_brand}, updated_at=NOW()
      WHERE ${whereClause} RETURNING *`;

    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    if (err.message.includes('duplicate key value') && err.message.includes('slug')) {
      res.status(400).json({ error: 'A brand with this slug already exists.' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
};

// Delete brand by ID or slug
exports.remove = async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const [brand] = isNumericId(identifier)
      ? await sql`SELECT * FROM brand WHERE id=${identifier}`
      : await sql`SELECT * FROM brand WHERE slug=${identifier}`;

    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const imageUrls = [brand.logo_url, brand.banner_url].filter(Boolean);

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
          console.error('ImageKit delete error:', imagekitErr);
        }
      }
    }

    const whereClause = isNumericId(identifier)
      ? sql`id = ${identifier}`
      : sql`slug = ${identifier}`;

    await sql`DELETE FROM brand WHERE ${whereClause}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
