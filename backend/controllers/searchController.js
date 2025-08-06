const sql = require('../config/supabase');

exports.search = async (req, res) => {
  try {
    const { 
      q: query, 
      type, 
      limit = 10, 
      offset = 0,
      sortBy = 'relevance',
      category,
      medicine_type,
      brand_id,
      min_price,
      max_price,
      prescription_required,
      in_stock = true
    } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = query.trim().toLowerCase();
    const searchPattern = `%${searchTerm}%`;
    const results = {};

    // Product Search
    if (!type || type === 'products') {
      let productQuery = sql`
        SELECT p.*, b.name AS brand_name,
          CASE 
            WHEN LOWER(p.name) = ${searchTerm} THEN 100
            WHEN LOWER(p.name) LIKE ${searchTerm + '%'} THEN 90
            WHEN LOWER(p.key) LIKE ${searchTerm + '%'} THEN 80
            WHEN LOWER(p.name) LIKE ${searchPattern} THEN 70
            WHEN LOWER(p.key_ingredients) LIKE ${searchPattern} THEN 60
            WHEN LOWER(p.description) LIKE ${searchPattern} THEN 50
            WHEN LOWER(p.strength) LIKE ${searchPattern} THEN 40
            ELSE 30
          END AS relevance_score
        FROM product p
        LEFT JOIN brand b ON p.brand_id = b.id
        WHERE (
          LOWER(p.name) LIKE ${searchPattern} OR 
          LOWER(p.key) LIKE ${searchPattern} OR 
          LOWER(p.key_ingredients) LIKE ${searchPattern} OR 
          LOWER(p.description) LIKE ${searchPattern} OR
          LOWER(p.strength) LIKE ${searchPattern} OR
          LOWER(b.name) LIKE ${searchPattern}
        )
      `;

      if (category) productQuery = sql`${productQuery} AND p.category = ${category}`;
      if (medicine_type) productQuery = sql`${productQuery} AND p.medicine_type = ${medicine_type}`;
      if (brand_id) productQuery = sql`${productQuery} AND p.brand_id = ${brand_id}`;
      if (min_price) productQuery = sql`${productQuery} AND p.selling_price >= ${parseFloat(min_price)}`;
      if (max_price) productQuery = sql`${productQuery} AND p.selling_price <= ${parseFloat(max_price)}`;
      if (prescription_required !== undefined) productQuery = sql`${productQuery} AND p.prescription_required = ${prescription_required === 'true'}`;
      if (in_stock === 'true') productQuery = sql`${productQuery} AND p.total_quantity > 0`;

      // Sort
      if (sortBy === 'price_low') productQuery = sql`${productQuery} ORDER BY p.selling_price ASC`;
      else if (sortBy === 'price_high') productQuery = sql`${productQuery} ORDER BY p.selling_price DESC`;
      else if (sortBy === 'name') productQuery = sql`${productQuery} ORDER BY p.name ASC`;
      else if (sortBy === 'newest') productQuery = sql`${productQuery} ORDER BY p.created_at DESC`;
      else productQuery = sql`${productQuery} ORDER BY relevance_score DESC, p.id DESC`;

      productQuery = sql`${productQuery} LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
      results.products = await productQuery;
    }

    // Brand Search
    if (!type || type === 'brands') {
      const brandQuery = sql`
        SELECT *,
          CASE 
            WHEN LOWER(name) = ${searchTerm} THEN 100
            WHEN LOWER(name) LIKE ${searchTerm + '%'} THEN 90
            WHEN LOWER(name) LIKE ${searchPattern} THEN 70
            ELSE 50
          END AS relevance_score
        FROM brand
        WHERE LOWER(name) LIKE ${searchPattern}
        ORDER BY relevance_score DESC, id DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
      results.brands = await brandQuery;
    }

    // Disease Search
    if (!type || type === 'diseases') {
      const diseaseQuery = sql`
        SELECT *,
          CASE 
            WHEN LOWER(name) = ${searchTerm} THEN 100
            WHEN LOWER(name) LIKE ${searchTerm + '%'} THEN 90
            WHEN LOWER(name) LIKE ${searchPattern} THEN 70
            ELSE 50
          END AS relevance_score
        FROM disease
        WHERE LOWER(name) LIKE ${searchPattern}
        ORDER BY relevance_score DESC, id DESC
        LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
      `;
      results.diseases = await diseaseQuery;
    }

    // Category Matching
    if (!type || type === 'categories') {
      const medicineCategories = [
        { id: 1, name: 'Ayurvedic', description: 'Traditional Indian medicine system' },
        { id: 2, name: 'Unani', description: 'Traditional Arabic and Persian medicine' },
        { id: 3, name: 'Homeopathic', description: 'Alternative medicine based on dilutions' },
        { id: 4, name: 'Allopathic', description: 'Modern conventional medicine' }
      ];

      results.categories = medicineCategories
        .filter(cat => cat.name.toLowerCase().includes(searchTerm))
        .map(cat => ({
          ...cat,
          relevance_score: cat.name.toLowerCase() === searchTerm ? 100 :
            cat.name.toLowerCase().startsWith(searchTerm) ? 90 : 70
        }))
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    }

    // Count Products for Pagination
    const totalCounts = {};
    if (results.products) {
      const [countResult] = await sql`
        SELECT COUNT(*) as total
        FROM product p
        LEFT JOIN brand b ON p.brand_id = b.id
        WHERE (
          LOWER(p.name) LIKE ${searchPattern} OR 
          LOWER(p.key) LIKE ${searchPattern} OR 
          LOWER(p.key_ingredients) LIKE ${searchPattern} OR 
          LOWER(p.description) LIKE ${searchPattern} OR
          LOWER(p.strength) LIKE ${searchPattern} OR
          LOWER(b.name) LIKE ${searchPattern}
        )
        ${category ? sql`AND p.category = ${category}` : sql``}
        ${medicine_type ? sql`AND p.medicine_type = ${medicine_type}` : sql``}
        ${brand_id ? sql`AND p.brand_id = ${brand_id}` : sql``}
        ${min_price ? sql`AND p.selling_price >= ${parseFloat(min_price)}` : sql``}
        ${max_price ? sql`AND p.selling_price <= ${parseFloat(max_price)}` : sql``}
        ${prescription_required !== undefined ? sql`AND p.prescription_required = ${prescription_required === 'true'}` : sql``}
        ${in_stock === 'true' ? sql`AND p.total_quantity > 0` : sql``}
      `;
      totalCounts.products = parseInt(countResult.total);
    }

    res.json({
      query,
      results,
      totalCounts,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: Object.values(totalCounts).some(count => count > parseInt(offset) + parseInt(limit))
      },
      filters: {
        category,
        medicine_type,
        brand_id,
        min_price,
        max_price,
        prescription_required,
        in_stock
      },
      sortBy
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.suggestions = async (req, res) => {
  try {
    const { q: query, limit = 5 } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json({ suggestions: [] });
    }

    const searchTerm = query.trim().toLowerCase();
    const pattern = `${searchTerm}%`;

    const productSuggestions = await sql`
      SELECT DISTINCT name AS suggestion, 'product' AS type
      FROM product
      WHERE LOWER(name) LIKE ${pattern}
      ORDER BY name
      LIMIT ${parseInt(limit)}
    `;

    const brandSuggestions = await sql`
      SELECT DISTINCT name AS suggestion, 'brand' AS type
      FROM brand
      WHERE LOWER(name) LIKE ${pattern}
      ORDER BY name
      LIMIT ${parseInt(limit)}
    `;

    const diseaseSuggestions = await sql`
      SELECT DISTINCT name AS suggestion, 'disease' AS type
      FROM disease
      WHERE LOWER(name) LIKE ${pattern}
      ORDER BY name
      LIMIT ${parseInt(limit)}
    `;

    const allSuggestions = [
      ...productSuggestions,
      ...brandSuggestions,
      ...diseaseSuggestions
    ].slice(0, parseInt(limit));

    res.json({ suggestions: allSuggestions });
  } catch (err) {
    console.error('Suggestion error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.popular = async (req, res) => {
  try {
    // Get popular products with full data
    const popularProducts = await sql`
      SELECT id, name, slug, 'product' AS type
      FROM product
      WHERE top_products = true OR frequently_bought = true OR people_preferred = true
      ORDER BY RANDOM()
      LIMIT 3
    `;

    // Get popular brands with full data
    const popularBrands = await sql`
      SELECT id, name, slug, 'brand' AS type
      FROM brand
      ORDER BY RANDOM()
      LIMIT 2
    `;

    // Get popular diseases with full data
    const popularDiseases = await sql`
      SELECT id, name, slug, 'disease' AS type
      FROM disease
      ORDER BY RANDOM()
      LIMIT 2
    `;

    // Get popular main categories with full data
    const popularMainCategories = await sql`
      SELECT id, name, slug, 'main_category' AS type
      FROM main_category
      ORDER BY RANDOM()
      LIMIT 2
    `;

    const popular = [
      ...popularProducts,
      ...popularBrands,
      ...popularDiseases,
      ...popularMainCategories
    ];

    res.json({ popular });
  } catch (err) {
    console.error('Popular search error:', err);
    res.status(500).json({ error: err.message });
  }
};
