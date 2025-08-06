const sql = require('../config/supabase');
const imagekit = require('../config/imagekit');
const extractImageKitFileId = require('../utils/extractImageKitFileId');

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await sql`
      SELECT b.*, p.slug as product_slug 
      FROM banner b 
      LEFT JOIN product p ON b.product_id = p.id 
      ORDER BY b.id DESC`;
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const [banner] = await sql`
      SELECT b.*, p.slug as product_slug 
      FROM banner b 
      LEFT JOIN product p ON b.product_id = p.id 
      WHERE b.id = ${req.params.id}`;
    if (!banner) return res.status(404).json({ error: 'Not found' });
    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create banner
exports.createBanner = async (req, res) => {
  const { image_url, type, title, link, product_id } = req.body;
  const status = req.body.status || 'active';
  
  if (!image_url || !type) {
    return res.status(400).json({ error: 'Image URL and type are required' });
  }
  
  try {
    // Convert product_id to integer if it exists and is not empty
    const productIdValue = product_id && product_id !== '' ? parseInt(product_id, 10) : null;
    
    console.log('Banner creation data:', {
      image_url,
      type,
      title: title || null,
      link: link || null,
      status,
      product_id: productIdValue
    });
    
    const [banner] = await sql`
      INSERT INTO banner (image_url, type, title, link, status, product_id)
      VALUES (${image_url}, ${type}, ${title || null}, ${link || null}, ${status}, ${productIdValue})
      RETURNING *`;
    res.status(201).json(banner);
  } catch (err) {
    console.error('Error creating banner:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  const { image_url, type, title, link, product_id } = req.body;
  const status = req.body.status || 'active';
  
  if (!image_url || !type) {
    return res.status(400).json({ error: 'Image URL and type are required' });
  }
  
  try {
    // Convert product_id to integer if it exists and is not empty
    const productIdValue = product_id && product_id !== '' ? parseInt(product_id, 10) : null;
    
    const [banner] = await sql`
      UPDATE banner SET image_url=${image_url}, type=${type}, title=${title || null}, link=${link || null}, status=${status}, product_id=${productIdValue}, updated_at=NOW()
      WHERE id=${req.params.id} RETURNING *`;
    if (!banner) return res.status(404).json({ error: 'Not found' });
    res.json(banner);
  } catch (err) {
    console.error('Error updating banner:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete banner (and remove ImageKit image if exists)
exports.deleteBanner = async (req, res) => {
  try {
    const [banner] = await sql`SELECT * FROM banner WHERE id=${req.params.id}`;
    if (!banner) return res.status(404).json({ error: 'Not found' });

    if (banner.image_url) {
      const filePath = extractImageKitFileId(banner.image_url);
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

    await sql`DELETE FROM banner WHERE id=${req.params.id}`;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
