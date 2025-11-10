const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/customers', require('./routes/customerRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/orderdetails', require('./routes/orderDetailRoutes'));

app.use('/ftp', require('./routes/ftpRoutes'));

app.use('/auth', require('./routes/authRoutes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: false,
  swaggerOptions: {
    docExpansion: 'none', // 👈 همه تب‌ها بسته باشند
    operationsSorter: 'alpha', // مرتب‌سازی الفبایی (اختیاری)
    tagsSorter: 'alpha',       // مرتب‌سازی تگ‌ها (اختیاری)
  },
}));

app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api-docs`);
});
