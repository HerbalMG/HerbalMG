const express = require('express');
const app = express();

// Import routes
const userRoutes = require('./routes/userRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const blogRoutes = require('./routes/blogRoutes');
const referenceBookRoutes = require('./routes/referenceBookRoutes');
const brandRoutes = require('./routes/brandRoutes');
const customerRoutes = require('./routes/customerRoutes');
const addressRoutes = require('./routes/addressRoutes');
const googleSheetsRoutes = require('./routes/googleSheetsRoutes');

const deliveryStatusRoutes = require('./routes/deliveryStatus');
const diseaseRoutes = require('./routes/disease');
const doctorRoutes = require('./routes/doctor');
const imageRouter = require('./routes/image');

const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes');
const mainCategoryRouter = require('./routes/mainCategory');
const orderItemRoutes = require('./routes/orderItem');

const paymentRoutes = require('./routes/payment');
const productPriceRoutes = require('./routes/productPrice');

const productRoutes = require('./routes/product');
const searchRoutes = require('./routes/search');
const subCategoryRoutes = require('./routes/subCategory');
const uploadRoutes = require('./routes/upload');
const migrationRoutes = require('./routes/migration');
const productDiseaseRoutes = require('./routes/productDisease');



// Built-in middleware
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Use routes - All API routes should be prefixed with /api
app.use('/api/users', userRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reference-books', referenceBookRoutes);
app.use('/api/brand', brandRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api', googleSheetsRoutes);
app.use('/api/delivery_status', deliveryStatusRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/images', imageRouter);
app.use('/api', locationRoutes);
app.use('/api', authRoutes); // This will make /api/login and /api/logout available
app.use('/api/main-category', mainCategoryRouter);
app.use('/api/category', mainCategoryRouter); // Also mount as /category for compatibility
app.use('/api/order-items', orderItemRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/product', productRoutes);
app.use('/api/product_price', productPriceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/sub-categories', subCategoryRoutes);
app.use('/api', uploadRoutes);
app.use('/api/migration', migrationRoutes);
app.use('/api/product-disease', productDiseaseRoutes);

// Test route to verify Postgres connection
const sql = require('./config/supabase').default || require('./config/supabase');
app.get('/api/postgres-test', async (req, res) => {
  try {
    const result = await sql`SELECT 1 as test`;
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
