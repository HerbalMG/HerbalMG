// ImageKit storage configuration
// Note: ImageKit doesn't use multer storage engines like Cloudinary
// Instead, we handle uploads directly in the routes using imagekit.upload()
// This file is kept for compatibility but is no longer used

const multer = require('multer');

// Use memory storage for ImageKit uploads
const storage = multer.memoryStorage();

module.exports = storage;
