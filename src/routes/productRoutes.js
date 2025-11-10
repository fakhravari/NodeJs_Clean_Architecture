const express = require('express');
const router = express.Router();
const c = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: مدیریت محصولات
 */

router.get('/', c.list);

router.get('/:id', c.get);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: افزودن محصول
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ProductName: { type: string }
 *               Price: { type: number }
 *               Stock: { type: integer }
 *     responses:
 *       200: { description: موفق }
 */
router.post('/', c.create);

router.put('/:id', c.update);
router.delete('/:id', c.remove);

module.exports = router;
