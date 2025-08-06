const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const requireAdminOrLimitedAdmin = require('../middleware/requireAdminOrLimitedAdmin');

// Public
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);

// Protected
router.post('/', auth, requireAdminOrLimitedAdmin, blogController.createBlog);
router.put('/:id', auth, requireAdminOrLimitedAdmin, blogController.updateBlog);
router.delete('/:id', auth, requireAdminOrLimitedAdmin, blogController.deleteBlog);

module.exports = router;
