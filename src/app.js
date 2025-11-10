const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger'); // یا './docs/openapi.json' اگر فایل JSON داری

const app = express();

// ✅ فعال‌سازی CORS برای تمام درخواست‌ها
app.use(cors());

// ✅ پشتیبانی از JSON در درخواست‌ها
app.use(bodyParser.json());

// ✅ مسیرهای CRUD
app.use('/customers', require('./routes/customerRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/orderdetails', require('./routes/orderDetailRoutes'));

// ✅ Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ هندل خطاهای عمومی
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message
  });
});

// ✅ پورت سازگار با Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api-docs`);
});
