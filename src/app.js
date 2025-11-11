const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./docs/swagger');
const { v4: uuidv4 } = require('uuid');
const AppError = require('./utils/AppError');

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
  const isProd = process.env.NODE_ENV === 'production';
  const errorId = uuidv4();

  console.error(`ErrorId=${errorId}`, { message: err.message, stack: err.stack, code: err.code, details: err.details });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { statusCode: err.statusCode, code: err.code, message: err.message },
    });
  }

  res.status(500).json({
    success: false,
    error: {
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'Internal Server Error' : err.message,
      errorId,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api-docs`);
});
