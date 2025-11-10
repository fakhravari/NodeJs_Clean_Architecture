// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/openapi.json'); // <-- این فایل را کپی کن داخل src/docs

const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.use(cors({
//   origin: ['https://kiandent.ir', 'https://nodejs.kiandent.ir']
// }));

app.use('/customers', require('./routes/customerRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/orderdetails', require('./routes/orderDetailRoutes'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(3000, () => console.log('🚀 http://localhost:3000/api-docs'));
