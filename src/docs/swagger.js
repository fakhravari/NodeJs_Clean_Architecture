const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kiandent Node.js API (Layered)',
      version: '1.0.0',
      description: 'CRUD برای Customers, Products, Orders, OrderDetails',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
