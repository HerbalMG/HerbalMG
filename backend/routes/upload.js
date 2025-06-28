const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Multer storage (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'banners' }, // Change folder if needed
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});

// Get all images from Cloudinary folder
router.get('/images', async (req, res) => {
  try {
    const { resources } = await cloudinary.search
      .expression('folder:banners') // Use the same folder as upload
      .sort_by('created_at', 'desc')
      .max_results(30)
      .execute();

    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch images', details: err.message });
  }
});

// Delete image by public_id
router.delete('/delete/:publicId', async (req, res) => {
  const publicId = req.params.publicId; // gets everything after /delete/
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Deleted', result });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err });
  }
});

module.exports = router;
